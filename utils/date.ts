export function getCurrentMonth() {
    const now = new Date();
    const year = now.getFullYear(); 
    const month = now.getMonth(); 
    const firstDay = new Date(year, month, 1); 
    const lastDay = new Date(year, month + 1, 0);
    return { startDate: firstDay, endDate: lastDay };
}

export function getPreviousMonth() {
    const now = new Date(); 
    const year = now.getFullYear(); 
    const month = now.getMonth(); 
    const firstDay = new Date(year, month - 1, 1); 
    const lastDay = new Date(year, month, 0); 
    return { startDate: firstDay, endDate: lastDay };
}