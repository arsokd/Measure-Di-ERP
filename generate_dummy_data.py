import json, random, datetime, re

# Set random seed for reproducible realistic data
random.seed(42)

# Date utilities
def format_ddmmyyyy(dt):
    return dt.strftime('%d/%m/%Y')

def random_date(start_dt, end_dt):
    delta = end_dt - start_dt
    random_days = random.randint(0, delta.days)
    return start_dt + datetime.timedelta(days=random_days)

start_2024 = datetime.date(2024, 4, 1)
end_2026 = datetime.date(2026, 7, 31)

# Employees reference
employees = [
    {"employeeId": "E-001", "fullName": "Ravichandran", "designation": "Managing Director", "role": "super_admin"},
    {"employeeId": "E-002", "fullName": "Murugan", "designation": "Sales & Marketing Head", "role": "admin"},
    {"employeeId": "E-003", "fullName": "Subhashini", "designation": "Onboard vertical head", "role": "manager"},
    {"employeeId": "E-004", "fullName": "Dipanwita", "designation": "Service Revenue & Crane weighing", "role": "staff"},
    {"employeeId": "E-005", "fullName": "Balaram", "designation": "Sr. Business Manager - Steel Industry", "role": "staff"},
    {"employeeId": "E-006", "fullName": "Mathiarasu", "designation": "Territory Head -  Karnataka", "role": "staff"},
    {"employeeId": "E-007", "fullName": "Sivakumar", "designation": "Territory Head -  Odisha & CG", "role": "staff"},
    {"employeeId": "E-008", "fullName": "Sandeep", "designation": "Business Manager - MP & UP", "role": "staff"},
    {"employeeId": "E-009", "fullName": "Manowharan", "designation": "Business Manager", "role": "staff"},
]

emp_map = {e["employeeId"]: e for e in employees}

# Customer profiles by region / segment
customers = {
    "E-003": [
        ("Tata Motors Commercial Vehicles", "27AAACT2341A1Z1", "Onboard Sales"),
        ("Ashok Leyland Mining Fleet", "33AAACA1122B1Z4", "Onboard Sales"),
        ("L&T Construction Machinery", "27AAACL3344C1Z9", "Project Sales"),
        ("Volvo Construction Equipment", "29AAACV5566D1Z2", "Onboard Sales"),
        ("Bharat Earth Movers Ltd (BEML)", "29AAACB7788E1Z7", "Project Sales"),
        ("Caterpillar India Logistics", "33AAACC9900F1Z3", "Onboard Sales")
    ],
    "E-004": [
        ("JSW Steel Ltd - Vijayanagar Works", "29AAACJ1011A1Z2", "Crane Weighing Systems"),
        ("SAIL Durgapur Steel Plant", "19AAACS1234D1Z5", "Warranty Service"),
        ("Tata Steel Long Products", "20AABCT8890C1Z8", "AMC Service"),
        ("Electrosteel Castings Ltd", "19AAACE4567F1Z1", "Paid/Out-of-Warranty Service"),
        ("Hindalco Industries Renukoot", "09AAACH8901G1Z6", "OEM Spares"),
        ("Jindal Stainless Ltd Jajpur", "21AAACJ2345H1Z3", "Installation & Commissioning")
    ],
    "E-005": [
        ("NTPC Ramagundam Super Thermal", "36AAACN3456K1Z9", "AMC Service"),
        ("Singareni Collieries Co Ltd (SCCL)", "36AAACS4567L1Z4", "Field Service"),
        ("Kesoram Cement Basantnagar", "36AAACK5678M1Z8", "Paid/Out-of-Warranty Service"),
        ("Telangana State Power Gen Corp", "36AAACT6789N1Z3", "Installation & Commissioning"),
        ("Sagar Cements Mattampally", "36AAACS7890P1Z7", "OEM Spares")
    ],
    "E-006": [
        ("JSW Steel Toranagallu Complex", "29AAACJ1011A1Z2", "Warranty Service"),
        ("KIOCL Kudremukh Iron Ore", "29AAACK8901R1Z5", "AMC Service"),
        ("JSW Cement Toranagallu", "29AAACJ9012S1Z0", "OEM Spares"),
        ("Heidelberg Cement Ammasandra", "29AAACH0123T1Z4", "Field Service")
    ],
    "E-007": [
        ("Vedanta Ltd Jharsuguda Smelter", "21AAACV1234U1Z9", "AMC Service"),
        ("Jindal Steel & Power Angul", "21AAACJ2345V1Z3", "Field Service"),
        ("Hindalco Lapanga Smelter", "21AAACH3456W1Z8", "OEM Spares"),
        ("SECL Korba Coalfields", "22AAACS4567X1Z2", "Installation & Commissioning")
    ],
    "E-008": [
        ("Ultratech Cement Maihar Works", "23AAACU1234Y1Z7", "AMC Service"),
        ("Prism Johnson Cement Satna", "23AAACP2345Z1Z1", "Field Service"),
        ("KJS Cement Maihar", "23AAACK3456A1Z6", "OEM Spares"),
        ("Jaypee Rewa Plant", "23AAACJ4567B1Z0", "Paid/Out-of-Warranty Service")
    ],
    "E-009": [
        ("Kirloskar Brothers Limited HO", "27AAACK1234C1Z5", "Warranty Service"),
        ("Cummins India Pune", "27AAACC2345D1Z9", "AMC Service"),
        ("Godrej & Boyce Mfg Co", "27AAACG3456E1Z4", "OEM Spares"),
        ("Thermax Limited Chinchwad", "27AAACT4567F1Z8", "Field Service")
    ]
}

# 1. Generate Orders
orders = []
ord_id_counter = 100

for yr_start, yr_end, fy_code in [(datetime.date(2024, 4, 1), datetime.date(2025, 3, 31), "2024-25"), 
                                 (datetime.date(2025, 4, 1), datetime.date(2026, 7, 31), "2025-26")]:
    
    # Generate orders per owner
    # E-003: ~5 Cr per yr -> 10-15 orders ranging from 15L to 80L
    # E-004: ~7 Cr per yr -> 15-20 orders ranging from 10L to 1.2 Cr
    # E-005: ~3 Cr per yr -> 8-12 orders ranging from 10L to 50L
    # E-006: ~2 Cr per yr -> 6-10 orders ranging from 8L to 40L
    # E-007: ~2 Cr per yr -> 6-10 orders ranging from 8L to 40L
    # E-008: ~0.5 Cr per yr -> 4-6 orders ranging from 3L to 15L
    # E-009: ~0.5 Cr per yr -> 4-6 orders ranging from 3L to 15L

    targets_specs = [
        ("E-003", "Sales", "Onboard Sales, Project Sales", 12, (2000000, 7500000)),
        ("E-004", "Service, Parts Sales, Projects", "Crane Weighing Systems", 16, (1500000, 11000000)),
        ("E-005", "Service, Parts Sales, Projects", "Steel Industry Projects & AMC", 10, (1200000, 5000000)),
        ("E-006", "Service, Parts Sales, Projects", "Karnataka Territory Service & Spares", 8, (1000000, 4000000)),
        ("E-007", "Service, Parts Sales, Projects", "Odisha & CG Territory Service & Spares", 8, (1000000, 4000000)),
        ("E-008", "Service, Parts Sales, Projects", "MP & UP Territory Service", 5, (500000, 1800000)),
        ("E-009", "Service, Parts Sales, Projects", "HO Book Service & Calibration", 5, (500000, 1800000)),
    ]

    inv_seq = 10
    for emp_id, vert, sub_vert_default, count, val_range in targets_specs:
        cust_list = customers[emp_id]
        for _ in range(count):
            ord_id_counter += 1
            dt = random_date(yr_start, yr_end)
            cust_name, gstin, sub_vert_specific = random.choice(cust_list)
            
            # Base order value rounded to nearest 10,000
            val = round(random.randint(val_range[0], val_range[1]) / 10000) * 10000
            gst = round(val * 0.18)
            total_inv = val + gst
            
            inv_no = f"INV/{fy_code}/{inv_seq:03d}"
            inv_seq += 1

            # Determine multi-contributor
            is_multi = (random.random() < 0.25)
            contributors = []
            contributor_ids = [emp_id]

            if is_multi:
                # E-002 Murugan or E-001 Ravichandran joins
                mgr_id = "E-002" if emp_id != "E-003" else "E-002"
                contributors = [
                    {"employeeId": emp_id, "employeeName": emp_map[emp_id]["fullName"], "contributionPct": 70},
                    {"employeeId": mgr_id, "employeeName": emp_map[mgr_id]["fullName"], "contributionPct": 30}
                ]
                contributor_ids.append(mgr_id)
            else:
                contributors = [
                    {"employeeId": emp_id, "employeeName": emp_map[emp_id]["fullName"], "contributionPct": 100}
                ]

            ord_obj = {
                "id": f"ord_{ord_id_counter}",
                "customerName": cust_name,
                "customerGstin": gstin,
                "vertical": vert,
                "subVertical": sub_vert_specific,
                "orderValue": val,
                "gstPct": 18,
                "gstAmount": gst,
                "totalInvoiceValue": total_inv,
                "hsnCode": "8423",
                "invoiceNumber": inv_no,
                "orderDate": format_ddmmyyyy(dt),
                "status": "Won",
                "lossReason": "",
                "remarks": f"Order won for {sub_vert_specific} supply & service execution",
                "contributors": contributors,
                "contributorIds": contributor_ids,
                "isMultiContributor": is_multi,
                "employeeId": emp_id,
                "employeeName": emp_map[emp_id]["fullName"],
                "createdAt": datetime.datetime.combine(dt, datetime.time(10, 0)).isoformat(),
                "updatedAt": datetime.datetime.combine(dt, datetime.time(10, 0)).isoformat()
            }
            orders.append(ord_obj)

print(f"Generated {len(orders)} Orders.")

# Sort orders by orderDate
orders.sort(key=lambda x: datetime.datetime.strptime(x["orderDate"], "%d/%m/%Y"))

# 2. Generate Leads
leads = []
lead_id_counter = 1
lead_statuses = ["Quoted", "Negotiation", "Won", "Lost", "Qualified", "New Enquiry"]

for emp_id in ["E-003", "E-004", "E-005", "E-006", "E-007", "E-008", "E-009"]:
    cust_list = customers[emp_id]
    emp_info = emp_map[emp_id]
    for i in range(15):
        cust_name, gstin, sub_v = random.choice(cust_list)
        dt = random_date(start_2024, end_2026)
        f_dt = dt + datetime.timedelta(days=random.randint(5, 30))
        st = random.choice(lead_statuses)
        val = round(random.randint(500000, 8000000) / 50000) * 50000

        lead_obj = {
            "id": f"lead_{lead_id_counter}",
            "employeeId": emp_id,
            "customerName": cust_name,
            "vertical": "Sales" if emp_id == "E-003" else "Service, Parts Sales, Projects",
            "subVertical": sub_v,
            "status": st,
            "expectedValue": val,
            "followUpDate": format_ddmmyyyy(f_dt),
            "createdDate": format_ddmmyyyy(dt),
            "contactPerson": f"Manager Purchase - {cust_name.split()[0]}",
            "contactPhone": f"+91 98390 {random.randint(10000, 99999)}",
            "remarks": f"Requirement for {sub_v} - initial technical discussions completed"
        }
        leads.append(lead_obj)
        lead_id_counter += 1

print(f"Generated {len(leads)} Leads.")

# 3. Generate Payments
payments = []
pay_id_counter = 1

for ord_item in orders[:80]: # Payments for majority of won orders
    pay_dt = datetime.datetime.strptime(ord_item["orderDate"], "%d/%m/%Y").date() + datetime.timedelta(days=random.randint(15, 60))
    if pay_dt <= end_2026:
        pay_obj = {
            "id": f"pay_{pay_id_counter}",
            "employeeId": ord_item["employeeId"],
            "customerName": ord_item["customerName"],
            "invoiceNumber": ord_item["invoiceNumber"],
            "amount": ord_item["totalInvoiceValue"],
            "paymentDate": format_ddmmyyyy(pay_dt),
            "mode": random.choice(["RTGS", "NEFT", "Direct Transfer"]),
            "remarks": f"Full payment received against invoice {ord_item['invoiceNumber']}"
        }
        payments.append(pay_obj)
        pay_id_counter += 1

print(f"Generated {len(payments)} Payments.")

# 4. Generate DWM Activities
dwm_activities = []
dwm_id_counter = 1

dwm_descriptions = [
    ("kra_1", "Site visit to customer plant for load cell calibration check", "Calibrated 4 load cells; certificate issued"),
    ("kra_2", "Demonstration of wireless crane scale unit to GM Operations", "Demo successful, customer requested commercial proposal"),
    ("kra_3", "Tender documentation preparation and online portal submission", "Bid submitted before deadline; awaiting tech opening"),
    ("kra_4", "Quarterly AMC preventive maintenance service for heavy weighbridge", "Completed mechanical alignment & electrical zero adjustment"),
    ("kra_5", "Payment collection follow-up visit to finance office", "Payment commitment received for next RTGS cycle"),
    ("kra_6", "Digital marketing lead enquiry verification and immediate WhatsApp follow-up", "Lead qualified and forwarded to area engineer"),
    ("kra_7", "Joint review meeting with vertical head regarding monthly AOP gap analysis", "Action plan finalized to close Q2 revenue targets"),
    ("kra_8", "On-site troubleshooting of display indicator in dusty mill environment", "Faulty cable replaced; scale restored to operational state")
]

for emp_id in ["E-002", "E-003", "E-004", "E-005", "E-006", "E-007", "E-008", "E-009"]:
    emp_info = emp_map[emp_id]
    # Sample 35 dates across 2024-2026
    for _ in range(35):
        dt = random_date(start_2024, end_2026)
        kra_id, desc, rem = random.choice(dwm_descriptions)
        
        dwm_obj = {
            "id": f"dwm_{dwm_id_counter}",
            "employeeId": emp_id,
            "employeeName": emp_info["fullName"],
            "date": format_ddmmyyyy(dt),
            "activityDescription": desc,
            "linkedKraId": kra_id,
            "linkedKra": "Key Operational KRA",
            "linkedAopLine": emp_info["designation"],
            "planStatus": "Planned",
            "accomplishmentStatus": "Done",
            "accomplishmentRemarks": rem,
            "plannedAt": datetime.datetime.combine(dt, datetime.time(9, 0)).isoformat(),
            "accomplishedAt": datetime.datetime.combine(dt, datetime.time(17, 30)).isoformat()
        }
        dwm_activities.append(dwm_obj)
        dwm_id_counter += 1

print(f"Generated {len(dwm_activities)} DWM Activities.")

# 5. Generate Attendance
attendance_logs = []
att_id_counter = 1

for emp_id in ["E-001", "E-002", "E-003", "E-004", "E-005", "E-006", "E-007", "E-008", "E-009"]:
    emp_info = emp_map[emp_id]
    for _ in range(25):
        dt = random_date(start_2024, end_2026)
        att_obj = {
            "id": f"att_{att_id_counter}",
            "employeeId": emp_id,
            "employeeName": emp_info["fullName"],
            "date": format_ddmmyyyy(dt),
            "punchInTime": datetime.datetime.combine(dt, datetime.time(9, random.randint(0, 15))).isoformat(),
            "punchOutTime": datetime.datetime.combine(dt, datetime.time(18, random.randint(0, 30))).isoformat(),
            "workedHours": round(random.uniform(8.0, 9.5), 1),
            "dwmPlanCount": random.randint(2, 4),
            "dwmAccomplishedCount": random.randint(2, 4),
            "status": "Completed"
        }
        attendance_logs.append(att_obj)
        att_id_counter += 1

print(f"Generated {len(attendance_logs)} Attendance records.")

# 6. Generate Reviews & Appraisals across 2024-2026
reviews = []
rev_id_counter = 1

months_2024_2026 = [
    ("April 2024", "01/04/2024", "30/04/2024"),
    ("May 2024", "01/05/2024", "31/05/2024"),
    ("June 2024", "01/06/2024", "30/06/2024"),
    ("Q1 FY25", "01/04/2024", "30/06/2024"),
    ("July 2024", "01/07/2024", "31/07/2024"),
    ("August 2024", "01/08/2024", "31/08/2024"),
    ("September 2024", "01/09/2024", "30/09/2024"),
    ("Q2 FY25", "01/07/2024", "30/09/2024"),
    ("October 2024", "01/10/2024", "31/10/2024"),
    ("November 2024", "01/11/2024", "30/11/2024"),
    ("December 2024", "01/12/2024", "31/12/2024"),
    ("Q3 FY25", "01/10/2024", "31/12/2024"),
    ("January 2025", "01/01/2025", "31/01/2025"),
    ("February 2025", "01/02/2025", "28/02/2025"),
    ("March 2025", "01/03/2025", "31/03/2025"),
    ("Q4 FY25", "01/01/2025", "31/03/2025"),
    ("FY25 Annual Appraisal", "01/04/2024", "31/03/2025"),
    ("April 2025", "01/04/2025", "30/04/2025"),
    ("May 2025", "01/05/2025", "31/05/2025"),
    ("June 2025", "01/06/2025", "30/06/2025"),
    ("Q1 FY26", "01/04/2025", "30/06/2025"),
    ("July 2025", "01/07/2025", "31/07/2025"),
    ("August 2025", "01/08/2025", "31/08/2025"),
    ("September 2025", "01/09/2025", "30/09/2025"),
    ("Q2 FY26", "01/07/2025", "30/09/2025"),
    ("October 2025", "01/10/2025", "31/10/2025"),
    ("November 2025", "01/11/2025", "30/11/2025"),
    ("December 2025", "01/12/2025", "31/12/2025"),
    ("Q3 FY26", "01/10/2025", "31/12/2025"),
    ("January 2026", "01/01/2026", "31/01/2026"),
    ("February 2026", "01/02/2026", "28/02/2026"),
    ("March 2026", "01/03/2026", "31/03/2026"),
    ("Q4 FY26", "01/01/2026", "31/03/2026"),
    ("FY26 Annual Appraisal", "01/04/2025", "31/03/2026"),
    ("April 2026", "01/04/2026", "30/04/2026"),
    ("May 2026", "01/05/2026", "31/05/2026"),
    ("June 2026", "01/06/2026", "30/06/2026"),
    ("July 2026", "01/07/2026", "31/07/2026")
]

for label, s_dt, e_dt in months_2024_2026:
    p_type = "Annual" if "Annual" in label else ("Quarterly" if "Q" in label else "Monthly")
    for emp_id in ["E-002", "E-003", "E-004", "E-005", "E-006", "E-007", "E-008", "E-009"]:
        emp_info = emp_map[emp_id]
        reviewer_id = "E-001" if emp_id == "E-002" else ("E-002" if emp_id in ["E-003", "E-004", "E-005", "E-006", "E-007", "E-008", "E-009"] else "E-002")
        reviewer_name = emp_map[reviewer_id]["fullName"]

        kpi_snap = round(random.uniform(85.0, 108.0), 1)
        dwm_snap = round(random.uniform(90.0, 99.0), 1)
        att_snap = round(random.uniform(92.0, 100.0), 1)

        rating = "Exceeds Expectations" if kpi_snap >= 98.0 else ("Meets Expectations" if kpi_snap >= 88.0 else "Needs Improvement")

        rev_obj = {
            "id": f"rev_{rev_id_counter}",
            "employeeId": emp_id,
            "employeeName": emp_info["fullName"],
            "reviewerId": reviewer_id,
            "reviewerName": reviewer_name,
            "periodType": p_type,
            "periodLabel": label,
            "periodStartDate": s_dt,
            "periodEndDate": e_dt,
            "kpiAchievementSnapshot": kpi_snap,
            "dwmComplianceSnapshot": dwm_snap,
            "attendanceSnapshot": att_snap,
            "rating": rating,
            "managerComments": f"Performance review for {label}. Target achievement at {kpi_snap}%. Strong DWM discipline and territory presence.",
            "employeeComments": f"Achieved key operational KRAs for {label}. Continuing focus on high-margin revenue lines.",
            "actionItems": f"Expand active customer base; follow up on open quotations within 48 hours.",
            "reviewDate": e_dt,
            "createdAt": datetime.datetime.now().isoformat()
        }
        reviews.append(rev_obj)
        rev_id_counter += 1

print(f"Generated {len(reviews)} Reviews across 2 years.")

# Export generated python dictionaries
with open("dummy_data.json", "w") as f:
    json.dump({
        "orders": orders,
        "leads": leads,
        "payments": payments,
        "dwmActivities": dwm_activities,
        "attendance": attendance_logs,
        "reviews": reviews
    }, f, indent=2)

print("Saved dummy_data.json successfully!")
