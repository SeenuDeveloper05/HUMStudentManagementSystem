class HumSmsDashboard extends HTMLElement {
    constructor() {
        super();
        const template = document.getElementById("hum_sms_dashboard");
        this.appendChild(template.content.cloneNode(true));
        this.selectors = {
            // KPI Cards
            totalStudents: "#hum_dashboard_total_students",
            totalTeachers: "#hum_dashboard_total_teachers",
            attendanceAverage: "#hum_dashboard_attendance_average",
            topScore: "#hum_dashboard_top_score",
            topperQuarter: "#hum_dashboard_topper_quarter",

            // Filter
            quarter: "#hum_dashboard_quarter",
            year: "#hum_dashboard_year",

            // Branch Chart
            branchChart: "#hum_dashboard_branch_chart",
            branchLegend: "#hum_dashboard_branch_legend",

            // Student Trend
            trendPlaceholder: "#hum_dashboard_trend_placeholder",
            trendContainer: "#hum_dashboard_trend_container",
            studentTrendChart: "#hum_dashboard_student_trend_chart",

            // Attendance
            attendanceChart: "#hum_dashboard_attendance_chart",
            presentCount: "#hum_dashboard_present_count",
            absentCount: "#hum_dashboard_absent_count",
            attendanceRate: "#hum_dashboard_attendance_rate",

            // Quick Actions
            addStudentButton: "#hum_dashboard_add_student",
            addTeacherButton: "#hum_dashboard_add_teacher",
            markEntryButton: "#hum_dashboard_mark_entry",
            viewResultsButton: "#hum_dashboard_view_results"
        };
        this.branchChartInstance = null;
        this.attendanceChartInstance = null;
        this.studentTrendChartInstance = null;
        this.branchList = ["CSCI", "BIOL", "COMM", "ZOOL", "ARTS"];
        this.branchColors = [
            "#2879e8",
            "#8954df",
            "#22a65b",
            "#ed922a",
            "#ef6464"
        ];
    }

    connectedCallback() {
        try {
            this.handlerYearOption();
            this.bindAllRequiredEvents();
            this.initializeToastr();
            this.getDashboardStudentCount();
            this.getDashboardTeacherCount();
            this.getDashboardBranchData();
            this.getDashboardAttendance();
            this.getDashboardTopper();
            this.getDashboardStudentTrend();
        } catch (error) {
            console.error(error);
        }
    }

    bindAllRequiredEvents() {
        $(this).on("click",[this.selectors.addStudentButton,this.selectors.addTeacherButton,this.selectors.markEntryButton,this.selectors.viewResultsButton].join(","),
                { classObject: this },
                this.handlerDashboardQuickAction
            )
            .on("change",[ this.selectors.quarter,this.selectors.year].join(","),{ classObject: this },this.handlerDashboardFilter);
    }
    initializeToastr() {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
            timeOut: 3000,
            preventDuplicates: true
        };
    }
  
    // Year dropdown + default to current quarter / year
    handlerYearOption() {
        const classObject = this;
        const today = new Date();
        const currentYear = today.getFullYear();
        let curyear = currentYear + 1;
        let options = "";
        for (let i = 0; i < 7; i++) {
            options += `<option value="${curyear}">${curyear}</option>`;
            curyear -= 1;
        }

        $(classObject).find(classObject.selectors.year)
            .html(`<option value="">Select Year</option>${options}`)
            .val(String(currentYear));

        $(classObject).find(classObject.selectors.quarter)
            .val("Q" + (Math.floor(today.getMonth() / 3) + 1));
    }
    handlerDashboardFilter(event) {
        const classObject = event.data.classObject;
        classObject.getDashboardAttendance();
        classObject.getDashboardTopper();
        classObject.getDashboardStudentTrend();
    }
    // Quick action buttons (working - unchanged)
    handlerDashboardQuickAction(event) {
        event.preventDefault();
        const classObject = event.data.classObject;
        const selectedPage = $(event.currentTarget).attr("data-page");
        const sidebarLink = $("hum-sidebar").find(
            `.sidebar-link[data-page="${selectedPage}"]`
        );
        if (sidebarLink.length) {
            sidebarLink.trigger("click");
        }
    }

    getSelectedQuarter() {
        const classObject = this;
        const quarter = $(classObject).find(classObject.selectors.quarter).val();
        const year = $(classObject).find(classObject.selectors.year).val();
        if (!quarter || !year) {
            return "";
        }
        return quarter + "-" + year;
    }
    dashboardFormatStudentRequest(branch, length) {
        return {
            draw: 1,
            length: length,
            start: 0,
            filter: {
                gender: "",
                residingStatusFlag: "",
                activeFlag: "A",
                branchOfStudy: branch
            },
            order: {
                column: "",
                type: ""
            },
            search: "",
            searchColumn: ""
        };
    }
    dashboardFormatAttendanceRequest(statusFlag, quarterValue) {
        return {
            draw: 1,
            length: 1,
            start: 0,

            attendanceFilter: {
                date: null,
                statusFlag: statusFlag,
                studentBranchOfStudy: "",
                sickLeaveStatusFlag: "",
                activitieStatusFlag: ""
            },
            order: {
                column: "sno",
                type: "asc"
            },
            search: "",
            searchColumn: "",

            filterBy: "Quarter",
            filterValue: quarterValue
        };
    }

    dashboardFormatReportRequest(quarterValue) {
        return {
            draw: 1,
            length: 1,
            start: 0,

            attendanceReportFilter: {
                quarter: quarterValue,
                complianceStatusFlag: "",
                studentBranchOfStudy: ""
            },

            order: {
                column: "",
                type: ""
            },

            search: "",
            searchColumn: ""
        };
    }

    getDashboardStudentCount() {
        const classObject = this;
        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/student/list",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(classObject.dashboardFormatStudentRequest("", 1)),
            success: function (response) {
                if (response.status === "Success") {
                    classObject.displayDashboardStudentCount(response);
                } else {
                    console.error(response.data);
                }
            },
            error: function (error) {
                console.error("Student count API error:", error.status, error.responseText);
                toastr.error("Unable to load student count");
            }
        });
    }

    displayDashboardStudentCount(response) {
        const classObject = this;
        $(classObject).find(classObject.selectors.totalStudents).text(response.recordsFiltered ?? "--");
    }
    
 getDashboardTeacherCount() {
    const classObject = this;
    $.ajax({
        url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/teacher/all",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            draw: 1,
            length: 10,
            start: 0,
            teacherFilter: {
                teacherActiveFlag: ""
            },
            order: {
                column: "sno",
                type: "desc"
            },
            search: "",
            searchColumn: "TeacherName"
        }),
        success: function (response) {
            if (response.status === "Success") {
                classObject.displayDashboardTeacherCount(response);
            } else {
                console.error(response);
            }
        },
        error: function (xhr) {
            console.error("Teacher API Error:", xhr.responseText);
            toastr.error("Unable to load teacher count");
        }
    });
}

    displayDashboardTeacherCount(response) {
        const classObject = this;
        $(classObject).find(classObject.selectors.totalTeachers).text(response.recordsTotal);
    }

    getDashboardBranchData() {
        const classObject = this;
        // stored by index so labels and colors always match
        const branchCounts = new Array(classObject.branchList.length);
        let completedRequests = 0;
        classObject.branchList.forEach(function (branch, index) {
            $.ajax({
                url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/student/list",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(classObject.dashboardFormatStudentRequest(branch, 1)),
                success: function (response) {
                    let count = 0;
                    if (response.status === "Success") {
                        count = Number(response.recordsFiltered || 0);
                    }

                    branchCounts[index] = { branch: branch, count: count };
                },
                error: function (error) {
                    console.error("Branch API error (" + branch + "):", error.status, error.responseText);
                    branchCounts[index] = { branch: branch, count: 0 };
                },
                complete: function () {
                    completedRequests++;
                    if (completedRequests === classObject.branchList.length) {
                        classObject.displayDashboardBranchChart(branchCounts);
                    }
                }
            });
        });
    }


    displayDashboardBranchChart(branchCounts) {
        const classObject = this;
        const branchLabels = branchCounts.map(item => item.branch);
        const branchValues = branchCounts.map(item => item.count);
        classObject.initializeBranchChart(branchLabels, branchValues);
        classObject.displayBranchLegend(branchLabels, branchValues);
    }

    initializeBranchChart(branchLabels, branchValues) {
        const classObject = this;
        const canvas = $(classObject).find(classObject.selectors.branchChart)[0];
        if (!canvas || typeof Chart === "undefined") {
            console.error("Chart.js is not loaded.");
            return;
        }
        if (classObject.branchChartInstance) {
            classObject.branchChartInstance.destroy();
        }
        // all values 0 -> Chart.js draws nothing, so show a grey ring
        const hasData = branchValues.some(value => value > 0);

        classObject.branchChartInstance = new Chart(canvas, {
            type: "doughnut",
            data: {
                labels: hasData ? branchLabels : ["No Data"],
                datasets: [{
                    data: hasData ? branchValues : [1],
                    backgroundColor: hasData ? classObject.branchColors : ["#e6ebf2"],
                    borderWidth: 2,
                    borderColor: "#ffffff"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: hasData }
                }
            }
        });
    }

    displayBranchLegend(branchLabels, branchValues) {

        const classObject = this;
        let legendHtml = "";
        branchLabels.forEach(function (branch, index) {
            legendHtml += `
                <div class="hum-branch-legend-item">
                    <span class="hum-branch-legend-dot"
                        style="background:${classObject.branchColors[index]}"></span>
                    <span>${branch}</span>
                    <strong>${branchValues[index]}</strong>
                </div>
            `;
        });

        $(classObject).find(classObject.selectors.branchLegend).html(legendHtml);
    }

    getDashboardAttendance() {
        const classObject = this;
        const quarterValue = classObject.getSelectedQuarter();
        if (!quarterValue) {
            return;
        }
        const counts = { P: 0, A: 0 };
        let completedRequests = 0;
        let hasError = false;
        ["P", "A"].forEach(function (statusFlag) {
            $.ajax({
                url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/attendance/list/byday",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(
                    classObject.dashboardFormatAttendanceRequest(statusFlag, quarterValue)
                ),

                success: function (response) {
                    if (response.status === "Success") {
                        counts[statusFlag] = Number(response.recordsFiltered || 0);
                    } else {
                        hasError = true;
                        console.error(response.data);
                    }
                },
                error: function (error) {
                    hasError = true;
                    console.error("Attendance API error:", error.status, error.responseText);
                },
                complete: function () {
                    completedRequests++;
                    if (completedRequests === 2) {
                        if (hasError) {
                            toastr.error("Unable to load attendance");
                            return;
                        }
                        classObject.displayDashboardAttendance(counts.P, counts.A);
                    }
                }
            });
        });
    }


    displayDashboardAttendance(presentCount, absentCount) {
        const classObject = this;
        const totalCount = presentCount + absentCount;
        const attendanceRate = totalCount > 0? ((presentCount / totalCount) * 100).toFixed(1): 0;
        $(classObject).find(classObject.selectors.attendanceAverage).text(attendanceRate + "%");
        $(classObject).find(classObject.selectors.presentCount).text(presentCount);
        $(classObject).find(classObject.selectors.absentCount).text(absentCount);
        $(classObject).find(classObject.selectors.attendanceRate).text(attendanceRate + "%");
        classObject.initializeAttendanceChart(presentCount, absentCount);
    }

    initializeAttendanceChart(presentCount, absentCount) {
        const classObject = this;
        const canvas = $(classObject).find(classObject.selectors.attendanceChart)[0];
        if (!canvas || typeof Chart === "undefined") {
            console.error("Chart.js is not loaded.");
            return;
        }
        if (classObject.attendanceChartInstance) {
            classObject.attendanceChartInstance.destroy();
        }
        const hasData = (presentCount + absentCount) > 0;
        classObject.attendanceChartInstance = new Chart(canvas, {
            type: "doughnut",
            data: {
                labels: hasData ? ["Present", "Absent"] : ["No Data"],
                datasets: [{
                    data: hasData ? [presentCount, absentCount] : [1],
                    backgroundColor: hasData ? ["#28b76b", "#ef6464"] : ["#e6ebf2"],
                    borderWidth: 2,
                    borderColor: "#ffffff"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "70%",
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: hasData }
                }
            }
        });
    }

    getDashboardTopper() {
        const classObject = this;
        const quarterValue = classObject.getSelectedQuarter();
        if (!quarterValue) {
            return;
        }
        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/mark/topper?quarter="
                + quarterValue,
            type: "POST",
            dataType: "json",

            success: function (response) {
                if (response.status === "Success" && response.data) {
                    classObject.displayDashboardTopper(response);
                } else {
                    $(classObject).find(classObject.selectors.topScore).text("--");
                }
            },
            error: function (error) {
                console.error("Topper API error:", error.status, error.responseText);
                toastr.error("Unable to load topper details");
            }
        });
    }
    displayDashboardTopper(response) {

        const classObject = this;

        const topperData = response.data;

        $(classObject).find(classObject.selectors.topScore)
            .text(topperData.totalMark ?? "--");

        $(classObject).find(classObject.selectors.topperQuarter)
            .text(topperData.quarterAndYear ?? topperData.quarter ?? "Selected Quarter");
    }

    getDashboardStudentTrend() {
        const classObject = this;
        // last 5 quarters ending with the selected quarter
        const selectedQuarter = classObject.getSelectedQuarter();
        const today = new Date();
        let quarter = Math.floor(today.getMonth() / 3) + 1;
        let year = today.getFullYear();
        if (selectedQuarter) {
            quarter = Number(selectedQuarter.split("-")[0].replace("Q", ""));
            year = Number(selectedQuarter.split("-")[1]);
        }
        const periods = [];
        for (let i = 0; i < 5; i++) {
            periods.unshift({ quarter: quarter, year: year });
            quarter--;
            if (quarter === 0) {
                quarter = 4;
                year--;
            }
        }
        const labels = periods.map(period => "Q" + period.quarter + "-" + period.year);
        const values = new Array(periods.length).fill(0);
        let completedRequests = 0;
        labels.forEach(function (quarterValue, index) {
            $.ajax({
                url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/attendanceReport/list",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(classObject.dashboardFormatReportRequest(quarterValue)),
                success: function (response) {
                    if (response.status === "Success") {
                        values[index] = Number(response.recordsFiltered || 0);
                    }
                },
                error: function (error) {
                    console.error("Student trend API error (" + quarterValue + "):", error.status, error.responseText);
                },
                complete: function () {
                    completedRequests++;
                    if (completedRequests === labels.length) {
                        classObject.displayDashboardStudentTrend(labels, values);
                    }
                }
            });
        });
    }

    displayDashboardStudentTrend(labels, values) {
        const classObject = this;
        const hasData = values.some(value => value > 0);
        // no data in any quarter -> keep the placeholder
        if (!hasData) {
            return;
        }
        classObject.initializeStudentTrendChart(
            labels.map(label => label.replace("-", " - ")),
            values
        );
    }


    initializeStudentTrendChart(labels, values) {

        const classObject = this;

        const canvas = $(classObject).find(classObject.selectors.studentTrendChart)[0];

        if (!canvas || typeof Chart === "undefined") {
            console.error("Chart.js is not loaded.");
            return;
        }
        $(classObject).find(classObject.selectors.trendPlaceholder).addClass("d-none");
        $(classObject).find(classObject.selectors.trendContainer).removeClass("d-none");

        if (classObject.studentTrendChartInstance) {
            classObject.studentTrendChartInstance.destroy();
        }
        classObject.studentTrendChartInstance = new Chart(canvas, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Students",
                    data: values,
                    borderColor: "#2879e8",
                    backgroundColor: "rgba(40, 121, 232, 0.12)",
                    borderWidth: 2.5,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#2879e8",
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    tension: 0.35,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: "#64748b", font: { size: 11 } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: "#eef2f7" },
                        ticks: { color: "#64748b", font: { size: 11 }, precision: 0 }
                    }
                }
            }
        });
    }

}

customElements.define("hum-sms-dashboard", HumSmsDashboard);