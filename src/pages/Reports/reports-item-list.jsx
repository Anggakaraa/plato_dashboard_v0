const Name = (cell) => cell.value ? cell.value : '';
const Smartphone = (cell) => cell.value ? cell.value : '';

const Disabled = (cell) => {
    const value = cell.value === undefined || cell.value === null ? '' : cell.value;
    return value.toString();
};

export {
    Name,
    Smartphone,
    Disabled
};
/** 
{"battery_voltage_min":4.04,
"classification":5,
"command_4_count":2,
"current_count":401,
"current_max":1.5,
"current_mean":1.35,
"current_median":1.5,
"current_min":0,
"current_most_frequent":1.5,
"elapsed_time":1044,
"electrode_voltage_max":7.44,
"electrode_voltage_mean":5.58,
"electrode_voltage_median":5.68,
"electrode_voltage_min":0,
"read_response_count":415,
"resistance_count":406,
"resistance_max":39.6,
"resistance_mean":4.62,
"resistance_median":3.89,
"resistance_min":3.32,
"stim_logic_pass_time_internal":13,
"stim_logic_pass_time_timestamp":14.12,
"time_duration":1820,
"time_effective":1820,
"write_command_count":10}

{"comment":"Keine Verbesserung spürbar, vielleicht nicht richtig auf Kopf gehabt",
"rating":1,
"share":false,
"timestamp":1693581145212
}
*/