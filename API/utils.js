exports.formatDatetime = (date) => {
    const now = date ? new Date(date) : new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    const dateLocal = new Date(now.getTime() - offsetMs);
    return dateLocal.toISOString().slice(0, 19).replace("T", " ");
    
};
exports.formatDate = (date) => {
    const now = date ? new Date(date) : new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    const dateLocal = new Date(now.getTime() - offsetMs);
    return dateLocal.toISOString().slice(0, 19).split("T")[0];   
};