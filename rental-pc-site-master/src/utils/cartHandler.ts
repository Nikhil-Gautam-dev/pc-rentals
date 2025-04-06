export const calculateTotal = (selectedPCs: any[]) => {
    let taxRate = 0.1; // 10% tax
    let discountRate = 0.05; // 5% discount
    let subtotal = selectedPCs.reduce((sum, pc) => {
        const unitPrice = pc.timeUnit === "day" ? pc.rentPerDay : pc.rentPerHour;
        return sum + unitPrice * pc.quantity * pc.timeValue;
    }, 0);
    let tax = subtotal * taxRate;
    let discount = subtotal * discountRate;
    return { subtotal, tax, discount, total: subtotal + tax - discount };
};