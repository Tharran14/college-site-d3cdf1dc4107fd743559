

async function loadJSON(file) {
    const response = await fetch(file + "?v=" + Date.now());

    if (!response.ok) {
        throw new Error("Could not load " + file);
    }

    return response.json();
}

function setStatus(message, type = "") {
    const status = document.getElementById("status");
    status.textContent = message;
    status.className = "status-message " + type;
}

async function start() {
    const slotsContainer = document.getElementById("slots");

    try {
        const data = await loadJSON("data.json");

        document.getElementById("college").textContent =
            data.collegeName;

        document.getElementById("participant").textContent =
            data.participantCode;

        slotsContainer.replaceChildren();

        data.labSlots.forEach((slot, index) => {
            const card = document.createElement("article");
            card.className = "slot-card";

            const top = document.createElement("div");
            top.className = "slot-top";

            const icon = document.createElement("div");
            icon.className = "slot-icon";
            icon.textContent = "💻";

            const number = document.createElement("span");
            number.className = "slot-number";
            number.textContent =
                "SESSION " + String(index + 1).padStart(2, "0");

            top.append(icon, number);

            const title = document.createElement("h3");
            title.textContent = slot;

            const description = document.createElement("p");
            description.textContent =
                "Be ready to practise, collaborate and develop your skills.";

            const tag = document.createElement("span");
            tag.className = "slot-tag";
            tag.textContent = "✓ Scheduled session";

            card.append(top, title, description, tag);
            slotsContainer.appendChild(card);
        });

        if (data.labSlots.length === 0) {
            slotsContainer.textContent =
                "No lab sessions have been added yet.";
        }

    } catch (error) {
        slotsContainer.replaceChildren();

        const message = document.createElement("div");
        message.className = "empty-state";
        message.textContent =
            "Could not load lab sessions. Check data.json and try again.";

        slotsContainer.appendChild(message);
        setStatus("Unable to load site data: " + error.message, "warning");
        return;
    }

    try {
        const build = await loadJSON("build.json");

        document.getElementById("build").textContent =
            JSON.stringify(build, null, 2);

        setStatus(
            "✓ Site loaded successfully. Deployment information is available.",
            "success"
        );
    } catch (error) {
        document.getElementById("build").textContent =
            "Build information will appear after the first successful GitHub Actions deployment.";

        setStatus(
            "Site data loaded. Waiting for deployment information.",
            "warning"
        );
    }
}

start();

