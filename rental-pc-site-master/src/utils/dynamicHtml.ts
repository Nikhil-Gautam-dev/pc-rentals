// Utility function to add rows to the User table
export function addUserRow(users: any[], parent: string) {
    const userTableBody = document.getElementById(parent);
    if (!userTableBody) {
        console.error(`Parent element with id "${parent}" not found.`);
        return;
    }

    // Clear existing content
    userTableBody.innerHTML = '';

    for (const user of users) {
        console.log(user?.currentlyRented?.join("\n"))

        if (!user.admin) {
            const row = document.createElement("tr");
            row.classList.add("admin-user-row");
            row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user?.pcRented?.join(",") || "didn't rented yet"}</td>
            <td>${user?.currentlyRented?.join(",") || "didn't rented yet"}</td>
            <td>${"Rs " + user.totalLifeTimePayment || 0}</td>
            <td>${"Rs " + user.pendingPayment || 0}</td>
        `;
            userTableBody.appendChild(row);
        }
    }
}


export const addPcRows = (pcs: any[], fn: (id: string) => void, tableBodySelector: string = "admin-pc-table-body", rowTag = "tr") => {
    const tableBody = document.getElementById(tableBodySelector);
    if (!tableBody) {
        console.error("Table body not found:", tableBodySelector);
        return;
    }

    tableBody.innerHTML = "";

    for (let pc of pcs) {

        const row = document.createElement(rowTag);
        row.classList.add("admin-pc-row");

        // Image Column
        const imgCell = document.createElement("td");
        const img = document.createElement("img");
        img.src = pc.image || "/default-image.jpg";
        img.alt = pc.name || "PC Image";
        img.width = 50;
        imgCell.appendChild(img);
        row.appendChild(imgCell);

        // Name Column
        const nameCell = document.createElement("td");
        // nameCell.contentEditable = "true";
        nameCell.textContent = pc.name || "Unknown PC";
        row.appendChild(nameCell);

        // Specs Column
        const specsCell = document.createElement("td");
        // specsCell.contentEditable = "true";
        const specsList = document.createElement("ul");
        (pc.specs || []).forEach((spec: string) => {
            const listItem = document.createElement("li");
            listItem.textContent = spec;
            specsList.appendChild(listItem);
        });
        specsCell.appendChild(specsList);
        row.appendChild(specsCell);

        // Rent per Day Column
        const rentDayCell = document.createElement("td");
        // rentDayCell.contentEditable = "true";
        rentDayCell.textContent = `Rs ${pc.rentPerDay || 0}`;
        row.appendChild(rentDayCell);

        // Rent per Hour Column
        const rentHourCell = document.createElement("td");
        // rentHourCell.contentEditable = "true";
        rentHourCell.textContent = `Rs ${pc.rentPerHour || 0}`;
        row.appendChild(rentHourCell);

        // const quantity = document.createElement("td");
        // // quantity.contentEditable = "true";
        // quantity.textContent = `${pc.quantity || 0}`;
        // row.appendChild(quantity);

        // Lifetime Earnings Column
        const earningsCell = document.createElement("td");
        earningsCell.textContent = `Rs ${pc.lifetime_earning || 0}`;
        row.appendChild(earningsCell);

        // Actions Column
        const actionsCell = document.createElement("td");
        // const saveButton = document.createElement("button");
        // saveButton.classList.add("admin-edit-btn");
        // saveButton.textContent = "Save";

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("admin-delete-btn");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => fn(pc._id))

        // actionsCell.appendChild(saveButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    }
}

