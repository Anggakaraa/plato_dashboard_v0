const Name = (cell) => cell.value ? cell.value : '';

const Disabled = (cell) => {
    const value = cell.value === undefined || cell.value === null ? '' : cell.value;
    return value.toString();
};

export {
    Name,
    Disabled
};