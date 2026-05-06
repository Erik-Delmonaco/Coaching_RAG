const form = document.getElementById("ask-form");
const questionInput = document.getElementById("question");
const submitButton = document.getElementById("submit-button");
const statusEl = document.getElementById("status");
const answerEl = document.getElementById("answer");
const answerCollectionEl = document.getElementById("answer-collection");

const collectionLabels = {
	roster_2026: "Roster",
	opponents_2026: "Opponents",
	scouting_2027: "Scouting",
};

function getSelectedCollection() {
	const selected = document.querySelector('input[name="collection"]:checked');
	return selected ? selected.value : "roster_2026";
}

function updateCollectionBadge() {
	const collection = getSelectedCollection();
	answerCollectionEl.textContent = collectionLabels[collection];
}

document.querySelectorAll('input[name="collection"]').forEach((input) => {
	input.addEventListener("change", updateCollectionBadge);
});

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const question = questionInput.value.trim();
	const collection = getSelectedCollection();

	if (!question) {
		statusEl.textContent = "Enter a question first.";
		questionInput.focus();
		return;
	}

	submitButton.disabled = true;
	statusEl.textContent = "Querying selected report...";
	answerEl.textContent = "Working...";
	updateCollectionBadge();

	try {
		const response = await fetch("/ask", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ question, collection }),
		});

		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}`);
		}

		const answer = await response.text();
		answerEl.textContent = answer;
		statusEl.textContent = "Answer ready.";
	} catch (error) {
		answerEl.textContent = "The request failed. Check that the API is running and try again.";
		statusEl.textContent = error.message;
	} finally {
		submitButton.disabled = false;
	}
});

updateCollectionBadge();
