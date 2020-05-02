function bestPassenger(): HTMLLIElement {
	const passengers = document.querySelectorAll('.osoba') as NodeListOf<HTMLLIElement>
	let best = passengers[0];
	for (let i = 1; i < passengers.length; i++) {
		const bestId = best.getAttribute('data-identyfikator-pasazera');
		const currId = passengers[i].getAttribute('data-identyfikator-pasazera');
		if (currId > bestId)
			best = passengers[i];
	}
	return best;
}

console.log(bestPassenger().textContent);

setTimeout(() => {
	console.log('No już wreszcie.');
}, 2000);