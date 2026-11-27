class HumHolidayManagement extends HTMLElement {
    // Creates the holiday management component and initializes its selectors, state, and calendar configuration.
    constructor() {
        super();
        const template = document.getElementById("hum_holiday_management");
        this.appendChild(template.content.cloneNode(true));
        this.selectors = {
            holidayManagement: ".hum-holiday-page",
            declareHolidayButton: "#hum_holiday_declare_button",
            cancelHolidayButton: "#hum_holiday_cancel_button",
            holidayTypeFilter: "#hum_holiday_type_filter",
            holidayStatusFilter: "#hum_holiday_status_filter",
            holidayMonthFilter: "#hum_holiday_month_filter",
            holidayFormFilter: ".form-holiday-filter",
            holidayYearValue: "#hum_holiday_year_value",
            applyFiltersButton: "#hum_holiday_apply_filters",
            resetFiltersButton: "#hum_holiday_reset_filters",
            holidayCalendarHeading: "#hum_holiday_calendar_heading",
            holidayCalendar: "#hum_holiday_calendar",
            declareHolidayModal: "#hum_holiday_declare_modal",
            holidayDateInput: "#holiday_date",
            holidayTypeInput: "#holiday_type",
            addAnotherHolidayButton: "#hum_holiday_add_another",
            saveHolidayButton: "#hum_holiday_save_btn",
            cancelHolidayModal: "#hum_holiday_cancel_modal",
            cancelHolidayDate: "#hum_holiday_cancel_date",
            cancelHolidayReason: "#hum_holiday_cancel_reason",
            confirmCancelHolidayButton: "#hum_holiday_confirm_cancel_btn",
            holidayDetailsModal: "#hum_holiday_details_modal",
            holidayDetailId: "#hum_holiday_detail_id",
            holidayDetailDate: "#hum_holiday_detail_date",
            holidayDetailType: "#hum_holiday_detail_type",
            holidayDetailStatus: "#hum_holiday_detail_status",
            holidayDetailReason: "#hum_holiday_detail_reason",
            holidayDetailsCancelButton: "#hum_holiday_details_cancel_btn",
            holidayTableBody: "#hum_holiday_table_body",
            holidayTable: ".hum-holiday-table",
            removeHolidayRow: ".hum-remove-holiday",
            holidayFilterChanges: "#hum_holiday_changes"
        };
        // list of holidays added in the declare modal
        this.holidayDeclareList = [];
        this.holidayCalendar = null;
        // holiday which is open in the details modal
        this.holidaySelected = null;
        this.holidayCalendarConfig = {
            initialView: "dayGridMonth",
            height: "auto",
            selectable: true,
            headerToolbar: {
                left: "prev,next",
                center: "title",
               right: "today dayGridMonth,timeGridWeek"
            },
            // calendar asks for events -> we call the holiday list API
            events: (fetchInfo, successCallBack, failureCallBack) => {
                this.holidayListApi(fetchInfo)
                    .then((holidayEvents) => {
                        successCallBack(holidayEvents);
                    })
                    .catch((error) => {
                        console.log(error);
                        failureCallBack(error);
                    });
            },
            // prev / next click -> month and year filter also changes
            datesSet: (dateInfo) => {
                this.holidaySyncMonthYearFilter(dateInfo);
            },
            // date click -> holiday already there ? show details : open declare modal
            dateClick: (info) => {
                this.holidayHandleDateClick(info);
            },
            eventClick: (info) => {
                this.holidayShowDetails(info.event.extendedProps);
            }
        };
    }

    // Initializes the holiday management page when the component is added to the document.
    connectedCallback() {
        try {
            this.handlerYearOption();
            this.initializeToastr();
            this.initializeHolidayValidation();
            this.initializeHolidayDatepicker();
            this.bindAllRequiredEvents();
            this.getHolidayList();
        }
        catch (error) {
            console.log(error);
        }
    }

    // Registers the event handlers for holiday actions, filters, and form inputs.
    bindAllRequiredEvents() {
        $(this)
            .on("click", this.selectors.declareHolidayButton, { classObject: this }, this.handlerDeclareBtnClick)
            .on("click", this.selectors.cancelHolidayButton, { classObject: this }, this.handlerCancelBtnClick)
            .on("click", this.selectors.applyFiltersButton, { classObject: this }, this.handlerApplyFilterBtn)
            .on("click", this.selectors.resetFiltersButton, { classObject: this }, this.handlerResetFilterBtn)
            .on("click", this.selectors.addAnotherHolidayButton, { classObject: this }, this.handlerAddAnotherHoliday)
            .on("click", this.selectors.saveHolidayButton, { classObject: this }, this.handlerSaveHolidays)
            .on("click", this.selectors.removeHolidayRow, { classObject: this }, this.handlerRemoveHoliday)
            .on("click", this.selectors.confirmCancelHolidayButton, { classObject: this }, this.handlerConfirmCancelHoliday)
            .on("click", this.selectors.holidayDetailsCancelButton, { classObject: this }, this.handlerCancelFromDetails)
            .on("input change", `${this.selectors.cancelHolidayDate}, ${this.selectors.cancelHolidayReason}`, { classObject: this }, this.handlerCancelHolidayInput)
            .on("input change", this.selectors.holidayFormFilter, { classObject: this }, this.handlerResetFilterVisibility);
    }

    // plugins
    // Configures Toastr notification settings for holiday management messages.
    initializeToastr() {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
            timeOut: 3000,
            preventDuplicates: true
        };
    }

    // Sets validation rules and messages for the declare and cancel holiday forms.
    initializeHolidayValidation() {
        const classObject = this;
        $(classObject.selectors.declareHolidayModal)
            .find("#hum_holiday_declare_form")
            .validate({
                rules: {
                    holidayDate: {
                        required: true
                    },
                    holidayType: {
                        required: true
                    }
                },
                messages: {
                    holidayDate: "Please select a holiday date.",
                    holidayType: "Please select a holiday type."
                },
                errorPlacement: function (error, element) {
                    error.css("color", "red");
                    if (element.closest(".input-group").length) {
                        error.insertAfter(element.closest(".input-group"));
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
        $(classObject.selectors.cancelHolidayModal)
            .find("#hum_holiday_cancel_form")
            .validate({
                rules: {
                    holidayDate: {
                        required: true
                    },
                    holidayCancelledReason: {
                        required: true,
                        maxlength: 500
                    }
                },
                messages: {
                    holidayDate: "Please select the holiday date.",
                    holidayCancelledReason: {
                        required: "Please enter the cancellation reason.",
                        maxlength: "Maximum 500 characters allowed."
                    }
                },
                errorPlacement: function (error, element) {
                    error.css("color", "red");
                    if (element.closest(".input-group").length) {
                        error.insertAfter(element.closest(".input-group"));
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
    }

    // Initializes date pickers for the holiday declaration and cancellation forms.
    initializeHolidayDatepicker() {
        const classObject = this;
        const datepickerConfig = {
            dateFormat: "m-d-Y",
            allowInput: true
        };
        $(classObject.selectors.holidayDateInput)
            .flatpickr(datepickerConfig);
        $(classObject.selectors.cancelHolidayDate)
            .flatpickr(datepickerConfig);
    }

    /* ---------------------- button handlers ---------------------- */
    // Handles the declare button click and opens the holiday declaration modal.
    handlerDeclareBtnClick(event) {
        const classObject = event.data.classObject;
        classObject.holidayOpenDeclareModal("");
    }

    // open declare modal (selectedDate = yyyy-mm-dd, empty when opened from the button)
    // Resets the declaration list and opens the modal with the selected date.
    holidayOpenDeclareModal(selectedDate) {
        const classObject = this;
        classObject.holidayDeclareList = [];
        classObject.displayDeclaredHolidayList();
        $(classObject.selectors.holidayDateInput).val(selectedDate || "");
        $(classObject.selectors.holidayTypeInput).val("");
        $(classObject.selectors.declareHolidayModal).modal("show");
    }

    // calendar date click
    // Handles calendar date selection and opens the appropriate modal.
    holidayHandleDateClick(info) {
        const classObject = this;

        const clickedDate = info.dateStr.substring(0, 10);
        const displayDate = classObject.holidayDisplayDate(clickedDate);

        const existingHoliday = classObject.holidayCalendar.getEvents().find(function (calendarEvent) {
            return calendarEvent.startStr.substring(0, 10) === clickedDate;
        });

        if (existingHoliday && existingHoliday.extendedProps.holidayCancelledFlag !== "Y") {
            classObject.holidayShowDetails(existingHoliday.extendedProps);
        } else {
            classObject.holidayOpenDeclareModal(displayDate);
        }
    }

    // Cancel button inside holiday details modal
    // Opens the cancellation modal for the selected active holiday.
    handlerCancelFromDetails(event) {
        const classObject = event.data.classObject;
        if (!classObject.holidaySelected || classObject.holidaySelected.holidayCancelledFlag === "Y") {
            return;
        }
        const selectedDate = classObject.holidayDisplayDate(classObject.holidaySelected.holidayDate);   // yyyy-mm-dd
        const confrimReason = classObject.selectors.cancelHolidayReason;
        // close details modal first, then open cancel modal (two modals should not overlap)
        $(classObject.selectors.confirmCancelHolidayButton).hide();
        $(classObject.selectors.holidayDetailsModal).one("hidden.bs.modal", function () {
            $(classObject.selectors.cancelHolidayDate).val(selectedDate);
            $(classObject.selectors.cancelHolidayReason).val("");
            $(classObject.selectors.cancelHolidayModal).modal("show", function () {
                if (confrimReason) {
                    $(classObject.selectors.confirmCancelHolidayButton).show();
                }
                else {
                    $(classObject.selectors.confirmCancelHolidayButton).hide();
                }
            });
        });
        $(classObject.selectors.holidayDetailsModal).modal("hide");
    }

    // Clears the cancellation form and opens the cancellation modal.
    handlerCancelBtnClick(event) {
        const classObject = event.data.classObject;
        $(classObject.selectors.cancelHolidayDate).val("");
        $(classObject.selectors.cancelHolidayReason).val("");
        $(classObject.selectors.confirmCancelHolidayButton).hide();
        $(classObject.selectors.cancelHolidayModal).modal("show");
    }

    // Shows or hides the confirmation button based on the cancellation form inputs.
    handlerCancelHolidayInput(event) {
        const classObject = event.data.classObject;
        const holidayDate = classObject.holidayDisplayDate(classObject.holidaySelected.holidayDate);
        const holidayType = $(classObject.selectors.cancelHolidayReason).val().trim();
        if (holidayDate && holidayType) {
            $(classObject.selectors.confirmCancelHolidayButton).show();
        }
        else {
            $(classObject.selectors.confirmCancelHolidayButton).hide();
        }
    }

    // Applies the selected month and year and refreshes the holiday calendar.
handlerApplyFilterBtn(event) {
    const classObject = event.data.classObject;
    const month = $(classObject.selectors.holidayMonthFilter).val();
    const year = $(classObject.selectors.holidayYearValue).val();
    classObject.holidayCalendar.gotoDate(year + "-" + month + "-01");
     $(classObject).find(classObject.selectors.holidayFilterChanges).text("");
    classObject.holidayCalendar.refetchEvents();
}

    // Resets the holiday filters to the current month and year.
handlerResetFilterBtn(event) {
    const classObject = event.data.classObject;
    const today = new Date();
    $(classObject.selectors.holidayTypeFilter).val("");
    $(classObject.selectors.holidayStatusFilter).val("");
    $(classObject.selectors.holidayMonthFilter)
        .val(String(today.getMonth() + 1).padStart(2, "0"));
    $(classObject.selectors.holidayYearValue).val(String(today.getFullYear()));
    classObject.holidayCalendar.gotoDate(today);
    classObject.holidayCalendar.refetchEvents();
    $(classObject.selectors.resetFiltersButton).addClass("d-none");
    $(classObject).find(classObject.selectors.holidayFilterChanges).text("");
}

    // Displays the reset button and filter-change message when a filter changes.
    handlerResetFilterVisibility(event) {
        const classObject = event.data.classObject;

        $(classObject.selectors.resetFiltersButton).removeClass("d-none");
        $(classObject).find(classObject.selectors.holidayFilterChanges).text("Filter conditions changed, Click submit.");

    }

    // Populates the year dropdown and sets the current month and year as defaults.
    // year dropdown + default month / year = today
    handlerYearOption() {
        const self = this;
        const today = new Date();
        let curyear = today.getFullYear() + 1;
        let options = "";
        for (let i = 0; i < 7; i++) {
            options += `<option value="${curyear}">${curyear}</option>`;
            curyear -= 1;
        }
        $(self.selectors.holidayYearValue).html(options);
        $(self.selectors.holidayYearValue).val(String(today.getFullYear()));
        $(self.selectors.holidayMonthFilter)
            .val(String(today.getMonth() + 1).padStart(2, "0"));
    }

    /* ---------------------- declare holidays ---------------------- */
    // Validates and adds a holiday entry to the declaration list.
    handlerAddAnotherHoliday(event) {
        const classObject = event.data.classObject;
        const holidayDate = $(classObject.selectors.holidayDateInput).val();
        const holidayType = $(classObject.selectors.holidayTypeInput).val();
        const validator = $(classObject.selectors.declareHolidayModal).find("#hum_holiday_declare_form").validate();
        if (
            !validator.element($(classObject.selectors.holidayDateInput)) ||
            !validator.element($(classObject.selectors.holidayTypeInput))
        ) {
            return;
        }
        const alreadyAdded = classObject.holidayDeclareList.some(function (holiday) {
            return holiday.holidayDate === holidayDate;
        });
        if (alreadyAdded) {
            toastr.error("This date is already added to the list.");
            return;
        }
        classObject.holidayDeclareList.push({
            holidayDate: holidayDate,
            holidayType: holidayType
        });
        classObject.displayDeclaredHolidayList();
        $(classObject.selectors.holidayDateInput).val("");
        $(classObject.selectors.holidayTypeInput).val("");
    }

    // Renders the holidays added to the declaration list.
    displayDeclaredHolidayList() {
        const classObject = this;
        let tableRows = "";
        if (classObject.holidayDeclareList.length > 0) {
            classObject.holidayDeclareList.forEach((holiday, index) => {
                tableRows += `
                    <tr>
                        <td>${classObject.holidayDisplayDate(holiday.holidayDate)}</td>
                        <td>${classObject.holidayTypeName(holiday.holidayType)}</td>
                        <td>
                            <button type="button"
                                class="btn btn-sm text-danger hum-remove-holiday"
                                data-index="${index}">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </td>
                    </tr>
                `;
            });
            // array length > 0 -> show table and save button
            $(classObject.selectors.holidayTable).removeClass("d-none");
            $(classObject.selectors.saveHolidayButton).removeClass("d-none");
        }
        else {
            $(classObject.selectors.holidayTable).addClass("d-none");
            $(classObject.selectors.saveHolidayButton).addClass("d-none");
        }
        $(classObject.selectors.holidayTableBody).html(tableRows);
    }

    // Removes the selected holiday from the declaration list.
    handlerRemoveHoliday(event) {
        const classObject = event.data.classObject;
        const index = Number($(event.currentTarget).attr("data-index"));
        classObject.holidayDeclareList.splice(index, 1);
        classObject.displayDeclaredHolidayList();
    }

    // Submits the declared holidays to the API and handles the response.
    handlerSaveHolidays(event) {
        event.preventDefault();
        const classObject = event.data.classObject;
        if (classObject.holidayDeclareList.length === 0) {
            toastr.warning("Please add at least one holiday.");
            return;
        }
        const firstSavedDate = classObject.holidayDeclareList[0].holidayDate;
        $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/holiday/declare",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(classObject.holidayFormatSaveData()),
            beforeSend: function () {
                $(classObject.selectors.saveHolidayButton).prop("disabled", true);
            },
            success: function (response) {
                $(classObject.selectors.saveHolidayButton).prop("disabled", false);

                const result = classObject.holidayReadApiResult(response);

                if (result.successDates.length > 0) {
                    toastr.success(response.data);

                    classObject.holidayDeclareList = classObject.holidayDeclareList.filter(function (holiday) {
                        const apiDate = classObject.holidayChangeDateFormat(holiday.holidayDate);
                        return result.successDates.indexOf(apiDate) === -1;
                    });

                    classObject.displayDeclaredHolidayList();

                    classObject.holidayCalendar.gotoDate(classObject.holidayCalendarDate(firstSavedDate));
                       classObject.holidayCalendar.refetchEvents();
                }

                if (result.failureMessages.length === 0) {
                    toastr.success("Holidays declared successfully.");
                    $(classObject.selectors.declareHolidayModal).modal("hide");
                }
                else {
                    toastr.error(result.failureMessages.join("\n"));

                    if (classObject.holidayDeclareList.length === 0) {
                        $(classObject.selectors.declareHolidayModal).modal("hide");
                    }
                }
            },
            error: function (xhr) {
                $(classObject.selectors.saveHolidayButton).prop("disabled", false);
                console.error(xhr.responseText);
                toastr.error("Unable to declare holidays. Please try again.");
            }
        });
    }

    // Formats the declaration list into the request data required by the API.
    holidayFormatSaveData() {
        const classObject = this;
        return classObject.holidayDeclareList.map((holiday) => {
            return {
                holidayId: null,
                holidayDate: classObject.holidayChangeDateFormat(holiday.holidayDate),   // dd-mm-yyyy
                holidayType: holiday.holidayType,
                teacherId: 1
            };
        });
    }
holidayCalendarDate(dateString) {
    if (!dateString) {
        return "";
    }
    const [month, day, year] = dateString.split("-");
    return year + "-" + month.padStart(2, "0") + "-" + day.padStart(2, "0");
}
    /* ---------------------- cancel holiday ---------------------- */
    // Validates and submits the selected holiday cancellation after confirmation.
    handlerConfirmCancelHoliday(event) {
        event.preventDefault();
        const classObject = event.data.classObject;
        const holidayDate = $(classObject.selectors.cancelHolidayDate).val();
        const cancelReason = $(classObject.selectors.cancelHolidayReason).val().trim();
        const cancelForm = $(classObject.selectors.cancelHolidayModal).find("#hum_holiday_cancel_form");
        if (!cancelForm.valid()) {
            return;
        }
        Swal.fire({
            title: "Cancel Holiday?",
            text: "Are you sure you want to cancel this holiday?",
            width: "300px",
            padding: "1rem",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            reverseButtons: true,
            customClass: {
                popup: "small-swal-popup",
                title: "small-swal-title",
                htmlContainer: "small-swal-text",
                confirmButton: "btn btn-sm btn-primary",
                cancelButton: "btn btn-sm btn-secondary"
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/holiday/cancel",
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify([
                        {
                            holidayDate: classObject.holidayChangeDateFormat(holidayDate),   // dd-mm-yyyy
                            holidayCancelledReason: cancelReason,
                            teacherId: 1
                        }
                    ]),
                    beforeSend: function () {
                        $(classObject.selectors.confirmCancelHolidayButton).prop("disabled", true);
                    },
                    success: function (response) {
                        $(classObject.selectors.confirmCancelHolidayButton).prop("disabled", false);
                        const result = classObject.holidayReadApiResult(response);
                        if (result.failureMessages.length === 0) {
                            toastr.success("Holiday cancelled successfully.");
                            $(classObject.selectors.cancelHolidayDate).val("");
                            $(classObject.selectors.cancelHolidayReason).val("");
                            $(classObject.selectors.cancelHolidayModal).modal("hide");
                           classObject.holidayCalendar.gotoDate(classObject.holidayCalendarDate(holidayDate));
                           classObject.holidayCalendar.refetchEvents();
                        }
                        else {
                            toastr.error(result.failureMessages.join("\n"));
                        }
                    },
                    error: function (xhr) {
                        $(classObject.selectors.confirmCancelHolidayButton).prop("disabled", false);
                        console.error(xhr.responseText);
                        toastr.error("Unable to cancel holiday. Please try again.");
                    }
                });
            }
        });
    }

    /* ---------------------- holiday list ---------------------- */
    // same idea as getStudentList : create once, next time just reload
    // Creates the calendar or refreshes its events when it already exists.
    getHolidayList() {
        if (this.holidayCalendar) {
            this.holidayCalendar.refetchEvents();
        }
        else {
            const month = $(this.selectors.holidayMonthFilter).val();
            const year = $(this.selectors.holidayYearValue).val();
            this.holidayCalendarConfig.initialDate = year + "-" + month + "-01";
            // assign first, then render (calendar fetches events on render)
            this.holidayCalendar = new FullCalendar.Calendar(
                $(this.selectors.holidayCalendar)[0],
                this.holidayCalendarConfig
            );
            this.holidayCalendar.render();
        }
    }

    // Gets the month and year represented by the calendar date range.
    // month and year of the page which calendar is showing (taken from visible range)
    holidayGetMonthYear(rangeStart, rangeEnd) {
        const middleTime = (rangeStart.getTime() + rangeEnd.getTime()) / 2;
        const middleDate = new Date(middleTime);
        return {
            month: String(middleDate.getMonth() + 1).padStart(2, "0"),
            year: String(middleDate.getFullYear())
        };
    }

    // Synchronizes the month and year filters with the calendar view.
    // calendar moved (prev / next / view change) -> update dropdowns
    holidaySyncMonthYearFilter(dateInfo) {
        const classObject = this;
        const monthYear = classObject.holidayGetMonthYear(dateInfo.start, dateInfo.end);
        $(classObject.selectors.holidayMonthFilter).val(monthYear.month);
        if ($(classObject.selectors.holidayYearValue).find('option[value="' + monthYear.year + '"]').length === 0) {
            $(classObject.selectors.holidayYearValue).append(`<option value="${monthYear.year}">${monthYear.year}</option>`);
        }
        $(classObject.selectors.holidayYearValue).val(monthYear.year);
    }

    // Builds the holiday list API request using the selected filters and calendar range.
    holidayFormatRequestData(fetchInfo) {
        const classObject = this;
        const monthYear = classObject.holidayGetMonthYear(fetchInfo.start, fetchInfo.end);
        classObject.holidayFilterRequest = {
            draw: 1,
            length: 10,
            start: 0,
            holidayFilter: {
                holidayType: $(classObject.selectors.holidayTypeFilter).val() || "",
                holidayStatusFlag: $(classObject.selectors.holidayStatusFilter).val() || "",
                holidayDate: null
            },
            order: {
                column: "sno",
                type: "desc"
            },
            filterBy: "Month",
            filterValue: monthYear.month + "-" + monthYear.year      // MM-YYYY
        };
        return classObject.holidayFilterRequest;
    }

    // Fetches holiday records from the API and returns the processed calendar events.
    holidayListApi(fetchInfo) {
        const classObject = this;
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "https://dev-api.humhealth.com/StudentManagementSystemAPI/holiday/list",
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(classObject.holidayFormatRequestData(fetchInfo)),
                success: function (response) {
                    resolve(classObject.displayHolidayDataList(response));
                },
                error: function (xhr) {
                    console.error(xhr.responseText);
                    reject(xhr);
                }
            });
        });
    }

    // Converts the holiday API response into FullCalendar event objects.
    // API response -> calendar events
    displayHolidayDataList(response) {
        const classObject = this;
        const holidayEvents = [];
        if (response.status === "Success" && Array.isArray(response.data)) {
            for (const res of response.data) {
                const dateParts = res.holidayDate.split("-");
                const holidayDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];  // yyyy-mm-dd
                const holidayName = classObject.holidayTypeName(res.holidayType);
                const isCancelled = res.holidayCancelledFlag === "Y";
                holidayEvents.push({
                    id: res.holidayId,
                    title: isCancelled ? holidayName + " (Cancelled)" : holidayName,
                    start: holidayDate,
                    allDay: true,
                    backgroundColor: isCancelled ? "#dc2626" : "#102f59",
                    borderColor: isCancelled ? "#dc2626" : "#102f59",
                    extendedProps: {
                        holidayId: res.holidayId,
                        holidayDate: holidayDate,
                        holidayType: res.holidayType,
                        holidayCancelledFlag: res.holidayCancelledFlag,
                        holidayCancelledReason: res.holidayCancelledReason
                    }
                });
            }
        }
        return holidayEvents;
    }

    // Displays the selected holiday details in the details modal.
    // holiday click -> details modal
    holidayShowDetails(holiday) {
        const classObject = this;
        const isCancelled = holiday.holidayCancelledFlag === "Y";
        classObject.holidaySelected = holiday;
        // cancel button works only for active holiday
        $(classObject.selectors.holidayDetailsCancelButton).prop("disabled", isCancelled);
        $(classObject.selectors.holidayDetailId).text(holiday.holidayId || "—");
        $(classObject.selectors.holidayDetailDate).text(classObject.holidayDisplayDate(holiday.holidayDate));
        $(classObject.selectors.holidayDetailType).text(classObject.holidayTypeName(holiday.holidayType) || "—");
        $(classObject.selectors.holidayDetailStatus).text(isCancelled ? "Cancelled" : "Active");
        $(classObject.selectors.holidayDetailReason).text(isCancelled ? (holiday.holidayCancelledReason || "—") : "—");
        $(classObject.selectors.holidayDetailsModal).modal("show");
    }

    /* ---------------------- common helpers ---------------------- */
    // Returns the display name for the supplied holiday type code.
    holidayTypeName(holidayType) {
        let holidayName = "";
        switch (holidayType) {
            case "WEEK":
                holidayName = "Weekly Off";
                break;
            case "NATL":
                holidayName = "National";
                break;
            case "FEST":
                holidayName = "Festival";
                break;
            case "INST":
                holidayName = "Institutional";
                break;
            case "EMER":
                holidayName = "Emergency";
                break;
            case "OTHR":
                holidayName = "Other";
                break;
            default:
                holidayName = "Holiday";
                break;
        }
        return holidayName;
    }

    // Converts holiday dates between the API and calendar display formats.
    // yyyy-mm-dd <-> dd-mm-yyyy (same swap works both ways)
    // Convert m-d-Y <-> Y-m-d
    holidayChangeDateFormat(dateString) {
        if (!dateString) {
            return "";
        }

        const [month, day, year] = dateString.split("-");

        return day.padStart(2, "0") + "-" +
            month.padStart(2, "0") + "-" + year;
    }

    holidayDisplayDate(dateString) {
        if (!dateString) {
            return "";
        }

        const dateParts = dateString.split("-");

        if (dateParts[0].length === 4) {
            return dateParts[1] + "-" + dateParts[2] + "-" + dateParts[0];
        }

        if (dateParts[2].length === 4) {
            return dateParts[1] + "-" + dateParts[0] + "-" + dateParts[2];
        }

        return dateString;
    }

    // Processes the declare or cancel API response into success and failure results.
    // declare / cancel API response ->
    // { totalcount, successCount, failureCount, responses:[{status, date, data}] }
    holidayReadApiResult(response) {
        const result = {
            successDates: [],
            failureMessages: []
        };
        if (!response || !Array.isArray(response.responses)) {
            result.failureMessages.push("Unexpected response from server.");
            return result;
        }
        for (const res of response.responses) {
            if (res.status === "Success") {
                result.successDates.push(res.date);
            }
            else {
                // failure data is an array of messages (or a single text)
                const message = Array.isArray(res.data) ? res.data.join(", ") : res.data;
                result.failureMessages.push(res.date + " : " + message);
            }
        }
        return result;
    }
}

customElements.define("hum-holiday-management", HumHolidayManagement);