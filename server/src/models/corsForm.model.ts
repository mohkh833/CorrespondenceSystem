let timeNow = Date.now()
export const formSchema = { components:[
    {
        type: 'textfield',
        label: 'Correspondence Number',
        formControlName: 'correspondence_no',
        key: 'correspondence_no',
        input: true
    },
    {
        type: 'textfield',
        label: 'CC Entity',
        formControlName: 'cc_entity',
        key: 'cc_entity',
        input: true
    },
    {
        type: 'textfield',
        label: 'Correspondence Type',
        key: 'correspondence_type',
        input: true
    },
    {
        type: 'textfield',
        label: 'Correspondence Subject',
        key: 'correspondence_subject',
        input: true
    },
    {
        type: 'textfield',
        label: 'Entry Number',
        key: 'entry_no',
        input: true
    },
    {
        type: 'textfield',
        label: 'To',
        key: 'to_entity',
        input: true
    },
    {
        type: 'textfield',
        label: 'To Department',
        key: 'to_department',
        input: true
    },
    {
        type: "select",
        label: "Priority",
        key: "priority",
        placeholder: "Select one",
        data: {
            values: [
            {value: 'High', label: 'High'},
            {value: 'Normal', label: 'Normal'},
            {value: 'Low', label: 'Low'},
        ]
        },
        dataSrc: "values",
        template: "<span>{{ item.label }}</span>",
        input: true
    },
    {
        type: "select",
        label: "Classification",
        key: "classification",
        placeholder: "Select one",
        data: {
            values: [
            {value: 'Confidential', label: 'Confidential'},
            {value: 'Normal', label: 'Normal'},
        ]
        },
        dataSrc: "values",
        template: "<span>{{ item.label }}</span>",
        input: true
    },
    {
        type: 'checkbox',
        label: 'Await Reply',
        key: 'await_reply',
        inputType: 'checkbox',
        input: true
    },
    {
        "label": "Due Date",
        "format": "yyyy-MM-dd",
        "tableView": false,
        "datePicker": {
            "disableWeekends": false,
            "disableWeekdays": false,
            "minDate": timeNow
        },
        "enableTime": false,
        "timePicker": {
            "showMeridian": false
        },
        "enableMinDateInput": false,
        "enableMaxDateInput": false,
        "key": "due_date",
        "type": "datetime",
        "input": true,
        "widget": {
            "type": "calendar",
            "displayInTimezone": "viewer",
            "locale": "en",
            "useLocaleSettings": false,
            "allowInput": true,
            "mode": "single",
            "enableTime": false,
            "noCalendar": false,
            "format": "yyyy-MM-dd",
            "hourIncrement": 1,
            "minuteIncrement": 1,
            "time_24hr": true,
            "minDate": timeNow,
            "disableWeekends": false,
            "disableWeekdays": false,
            "maxDate": null
        }
    },
    {
        "label": "Correspondence Body",
        "editor": "ckeditor",
        "tableView": true,
        "key": "correspondence_body",
        "type": "textarea",
        "rows": 5,
        "input": true,
        "isUploadEnabled": false
    },
    {
        type: 'button',
        action: 'submit',
        label: 'Send',
        theme: 'primary'
    }
]}