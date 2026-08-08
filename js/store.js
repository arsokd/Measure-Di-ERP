// js/store.js - Measure DI RevOps Global Store & Real-time Synchronization Engine

window.RevOpsStore = {
  isFirebaseAvailable: function() {
    return typeof window.db !== 'undefined' && window.db !== null && typeof window.db.collection === 'function';
  },

  reseedAllData: function() {
    console.log("Force re-seeding complete RevOps dataset...");
    var collections = ['employees', 'kraTargets', 'aopTargets', 'orders', 'dwmActivities', 'attendance', 'leads', 'payments', 'reviews', 'expenses', 'projectsMaster', 'expenseSplits', 'travelPolicyMaster', 'travelApprovals', 'budgets', 'serviceTickets'];
    collections.forEach(function(c) { localStorage.removeItem(c); });
    localStorage.removeItem('revops_seeded_v17');
    localStorage.removeItem('revops_seeded_v18');
    localStorage.removeItem('revops_seeded_v19');
    localStorage.removeItem('revops_seeded_v21');
    localStorage.removeItem('revops_seeded_v24');
    if (window.RevOpsStore.initSeedData) {
      window.RevOpsStore.initSeedData();
    }
    if (window.RevOpsStore.isFirebaseAvailable()) {
      window.RevOpsStore.syncAllToFirestore();
    }
    alert("Success! Re-seeded RevOps data across all collections.");
    window.location.reload();
  },

  syncAllToFirestore: function() {
    if (!window.db) return;
    console.log("Syncing data to Firebase Firestore...");
    var collections = ['employees', 'kraTargets', 'aopTargets', 'orders', 'dwmActivities', 'attendance', 'leads', 'payments', 'reviews', 'expenses', 'projectsMaster', 'expenseSplits', 'travelPolicyMaster', 'travelApprovals', 'budgets', 'serviceTickets'];
    collections.forEach(function(colName) {
      var items = window.RevOpsStore.getCollection(colName) || [];
      items.forEach(function(item) {
        var docId = item.id || (colName + '_' + Math.random().toString(36).substr(2, 9));
        window.db.collection(colName).doc(docId).set(item, { merge: true }).catch(function(err) {
          console.warn("Firestore sync error for " + colName + ":", err);
        });
      });
    });
  },

  getCollection: function(colName) {
    try {
      var raw = localStorage.getItem(colName);
      return raw ? JSON.parse(raw) : [];
    } catch(e) {
      return [];
    }
  },

  saveCollection: function(colName, items) {
    localStorage.setItem(colName, JSON.stringify(items));
  },

  setCollection: function(colName, items) {
    this.saveCollection(colName, items);
  },

  saveRecord: function(colName, record) {
    if (!record || typeof record !== 'object') return Promise.resolve(null);
    var sanitized = this.sanitizeRecord(record);
    if (!sanitized.id) {
      sanitized.id = colName.substring(0, 3) + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    }

    var items = this.getCollection(colName);
    var index = items.findIndex(function(it) { return it.id === sanitized.id || it.docId === sanitized.id; });
    if (index >= 0) {
      items[index] = Object.assign({}, items[index], sanitized);
    } else {
      items.push(sanitized);
    }
    this.saveCollection(colName, items);

    if (this.isFirebaseAvailable()) {
      try {
        return window.db.collection(colName).doc(sanitized.id).set(sanitized, { merge: true })
          .then(function() {
            return sanitized;
          })
          .catch(function(err) {
            console.error("Firestore saveRecord error for " + colName + "/" + sanitized.id + ":", err);
            return sanitized;
          });
      } catch (e) {
        console.error("Exception in saveRecord for " + colName + ":", e);
        return Promise.resolve(sanitized);
      }
    }
    return Promise.resolve(sanitized);
  },

  deleteRecord: function(colName, id) {
    var items = this.getCollection(colName);
    var filtered = items.filter(function(it) {
      return it.id !== id && it.docId !== id;
    });
    this.saveCollection(colName, filtered);

    if (this.isFirebaseAvailable()) {
      try {
        return window.db.collection(colName).doc(id).delete()
          .then(function() {
            return true;
          })
          .catch(function(err) {
            console.error("Firestore deleteRecord error for " + colName + "/" + id + ":", err);
            return false;
          });
      } catch (e) {
        console.error("Exception in deleteRecord for " + colName + ":", e);
        return Promise.resolve(false);
      }
    }
    return Promise.resolve(true);
  },

  addItem: function(colName, item) {
    if (!item.id) {
      item.id = colName.substring(0, 3) + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    }
    this.saveRecord(colName, item);
    return item;
  },

  updateItem: function(colName, id, updates) {
    var items = this.getCollection(colName);
    var target = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id || items[i].docId === id) {
        target = items[i];
        break;
      }
    }
    if (!target) target = { id: id };
    for (var key in updates) {
      target[key] = updates[key];
    }
    this.saveRecord(colName, target);
  },

  deleteItem: function(colName, id) {
    this.deleteRecord(colName, id);
  },

  subscribeRealtimeSync: function(colName, onDataUpdated) {
    if (!this.isFirebaseAvailable()) return null;
    try {
      var userRole = (typeof localStorage !== 'undefined') ? localStorage.getItem('userRole') : null;
      var empId = (typeof localStorage !== 'undefined') ? localStorage.getItem('employeeId') : null;

      var query = window.db.collection(colName);

      if (userRole === 'staff' && empId) {
        if (colName === 'attendance' || colName === 'dwmActivities') {
          query = query.where('employeeId', '==', empId);
        }
      }

      return query.onSnapshot(function(snapshot) {
        var remoteItems = [];
        snapshot.forEach(function(doc) {
          var data = doc.data();
          data.id = doc.id;
          remoteItems.push(data);
        });

        if (userRole === 'staff' && empId && (colName === 'attendance' || colName === 'dwmActivities')) {
          var existing = window.RevOpsStore.getCollection(colName) || [];
          var otherItems = existing.filter(function(it) { return it.employeeId !== empId; });
          var merged = otherItems.concat(remoteItems);
          localStorage.setItem(colName, JSON.stringify(merged));
          if (typeof onDataUpdated === 'function') onDataUpdated(merged);
        } else {
          localStorage.setItem(colName, JSON.stringify(remoteItems));
          if (typeof onDataUpdated === 'function') onDataUpdated(remoteItems);
        }
      }, function(err) {
        console.warn("Firestore snapshot listener error for " + colName + ":", err.message || err);
      });
    } catch(e) {
      console.warn("Failed to subscribe to real-time Firestore updates for " + colName + ":", e);
      return null;
    }
  },

  initSync: function() {
    this.initRealtimeSyncAll();
  },

  initRealtimeSyncAll: function() {
    if (!this.isFirebaseAvailable()) return;
    var collections = ['employees', 'kraTargets', 'aopTargets', 'orders', 'dwmActivities', 'attendance', 'leads', 'payments', 'reviews', 'expenses', 'projectsMaster', 'expenseSplits', 'travelPolicyMaster', 'travelApprovals', 'budgets', 'serviceTickets'];
    var self = this;
    collections.forEach(function(colName) {
      try {
        self.subscribeRealtimeSync(colName);
      } catch (e) {
        console.warn("Error initializing sync for " + colName + ":", e);
      }
    });
    console.log("⚡ Real-time Firestore sync active for concurrent user sessions.");
  },

  sanitizeRecord: function(item) {
    if (!item || typeof item !== 'object') return {};
    var sanitized = {};
    for (var key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        var val = item[key];
        if (typeof val === 'string') {
          sanitized[key] = val.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        } else {
          sanitized[key] = val;
        }
      }
    }
    if (!sanitized.updatedAt) {
      sanitized.updatedAt = new Date().toISOString();
    }
    return sanitized;
  },

  bulkUploadItems: function(colName, recordArray, callback) {
    if (!Array.isArray(recordArray) || recordArray.length === 0) {
      if (typeof callback === 'function') callback(0, "No valid records provided.");
      return;
    }
    var self = this;
    var currentItems = this.getCollection(colName);
    var count = 0;

    recordArray.forEach(function(rawRecord) {
      var record = self.sanitizeRecord(rawRecord);
      if (!record.id) {
        record.id = colName.substring(0, 3) + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      }
      currentItems.push(record);
      count++;
    });

    this.saveCollection(colName, currentItems);

    if (this.isFirebaseAvailable()) {
      try {
        var batch = window.db.batch();
        recordArray.forEach(function(rawRecord) {
          var record = self.sanitizeRecord(rawRecord);
          var docRef = window.db.collection(colName).doc(record.id);
          batch.set(docRef, record, { merge: true });
        });
        batch.commit().then(function() {
          console.log("✅ Bulk batch import committed to Firestore for " + colName + " (" + count + " items)");
          if (typeof callback === 'function') callback(count, null);
        }).catch(function(err) {
          console.warn("Bulk import Firestore batch warning:", err);
          if (typeof callback === 'function') callback(count, err.message);
        });
      } catch(e) {
        if (typeof callback === 'function') callback(count, null);
      }
    } else {
      if (typeof callback === 'function') callback(count, null);
    }
  }
};

// Global Helpers
function getFormattedToday() {
  var d = new Date();
  var day = String(d.getDate()).padStart(2, '0');
  var month = String(d.getMonth() + 1).padStart(2, '0');
  var year = d.getFullYear();
  return day + '/' + month + '/' + year;
}

function formatINR(val) {
  var num = Number(val) || 0;
  return 'Rs.' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function parseDateDDMMYYYY(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return new Date();
  var parts = dateStr.split('/');
  if (parts.length === 3) {
    return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
  }
  return new Date(dateStr);
}

function getFinancialYear(dateStr, invoiceNumber) {
  if (dateStr && typeof dateStr === 'string' && dateStr.trim()) {
    var trimmed = dateStr.trim();
    if (/^\d{4}-\d{2}$/.test(trimmed)) return trimmed;
    if (/^\d{4}-\d{4}$/.test(trimmed)) {
      return trimmed.substring(0, 5) + trimmed.substring(7);
    }
    var d = null;
    if (trimmed.indexOf('/') !== -1) {
      var parts = trimmed.split('/');
      if (parts.length >= 3) {
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1;
        var year = parseInt(parts[2], 10);
        if (year < 100) year += 2000;
        d = new Date(year, month, day);
      }
    } else if (trimmed.indexOf('-') !== -1) {
      var parts = trimmed.split('T')[0].split('-');
      if (parts.length >= 3) {
        var year = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1;
        var day = parseInt(parts[2], 10);
        d = new Date(year, month, day);
      }
    }
    if (!d || isNaN(d.getTime())) d = new Date(trimmed);
    if (d && !isNaN(d.getTime())) {
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      if (month >= 4) {
        var nextYr = (year + 1) % 100;
        return year + '-' + (nextYr < 10 ? '0' + nextYr : nextYr);
      } else {
        var prevYr = year - 1;
        var currYr = year % 100;
        return prevYr + '-' + (currYr < 10 ? '0' + currYr : currYr);
      }
    }
  }

  if (invoiceNumber && typeof invoiceNumber === 'string') {
    if (invoiceNumber.indexOf('2026-27') !== -1) return '2026-27';
    if (invoiceNumber.indexOf('2025-26') !== -1) return '2025-26';
    if (invoiceNumber.indexOf('2024-25') !== -1) return '2024-25';
  }

  return '2026-27';
}

window.getFormattedToday = getFormattedToday;
window.formatINR = formatINR;
window.parseDateDDMMYYYY = parseDateDDMMYYYY;
window.getFinancialYear = getFinancialYear;
