// ThreePeoplePray Component — "A" (Amor al prójimo / intercesión)
// Las 3 primeras personas son las del método RAP y siempre están presentes;
// a partir de ahí se pueden añadir y quitar tantas como se quiera.
import { storage } from '../state/storage.js';
import { icons } from './icons.js';
import { esc } from './escape.js';

const BASE_PEOPLE = 3;

const emptyPerson = () => ({ name: '', reason: '', prayed: false });

export function renderThreePeoplePray(container, { dailyEntry, frequentPeople, onUpdateEntry }) {
  const people = dailyEntry.people?.length ? dailyEntry.people : [emptyPerson(), emptyPerson(), emptyPerson()];

  // Garantiza siempre las 3 base, aunque vengan menos de una entrada antigua
  while (people.length < BASE_PEOPLE) people.push(emptyPerson());

  const entry = { ...dailyEntry, people };
  const rerender = () => renderThreePeoplePray(container, { dailyEntry: entry, frequentPeople, onUpdateEntry });
  const prayedCount = people.filter((p) => p.prayed).length;

  container.innerHTML = `
    <div class="stack-12 view-enter">
      <div class="screen-head">
        <h2 class="section-title">Tres personas por quienes orar</h2>
        <p class="section-subtitle">
          Escribe sus nombres y toca el círculo cuando hayas orado por cada una.
          ${people.length > BASE_PEOPLE ? `<br>Hoy llevas ${prayedCount} de ${people.length}.` : ''}
        </p>
      </div>

      <div class="frequent-contacts-bar">
        ${frequentPeople.map((fp) => `
          <button class="quick-contact-chip" data-name="${esc(fp.name)}" data-reason="${esc(fp.reason || '')}">${esc(fp.name)}</button>
        `).join('')}
      </div>

      ${people.map((p, idx) => `
        <div class="person-card ${p.prayed ? 'prayed' : ''}" data-index="${idx}">
          <div class="person-header">
            <button class="person-number-badge" data-action="toggle-pray" aria-label="Marcar como orado">
              ${p.prayed ? '✓' : idx + 1}
            </button>
            <input
              type="text"
              class="person-name-input"
              placeholder="Nombre"
              value="${esc(p.name || '')}"
              data-field="name"
            />
            ${idx >= BASE_PEOPLE ? `
              <button class="person-remove" data-action="remove" aria-label="Quitar persona">✕</button>
            ` : ''}
          </div>

          <input
            type="text"
            class="person-reason-input"
            placeholder="¿Por qué oras hoy por esta persona?"
            value="${esc(p.reason || '')}"
            data-field="reason"
          />
        </div>
      `).join('')}

      <button id="btn-add-person" class="add-person-btn">${icons.plus} Añadir otra persona</button>
    </div>
  `;

  // Contactos frecuentes → rellenan el primer nombre vacío, o añaden uno nuevo
  container.querySelectorAll('.quick-contact-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const name = chip.getAttribute('data-name');
      const reason = chip.getAttribute('data-reason');

      let idx = people.findIndex((p) => !p.name.trim());
      if (idx === -1) {
        people.push(emptyPerson());
        idx = people.length - 1;
      }

      people[idx].name = name;
      if (reason && !people[idx].reason) people[idx].reason = reason;

      onUpdateEntry({ ...entry });
      rerender();
    });
  });

  container.querySelector('#btn-add-person')?.addEventListener('click', () => {
    people.push(emptyPerson());
    onUpdateEntry({ ...entry });
    rerender();
    // Foco en el nombre de la persona recién añadida
    const inputs = container.querySelectorAll('.person-name-input');
    inputs[inputs.length - 1]?.focus();
  });

  container.querySelectorAll('.person-card').forEach((card) => {
    const idx = parseInt(card.getAttribute('data-index'));

    const nameInput = card.querySelector('[data-field="name"]');
    const reasonInput = card.querySelector('[data-field="reason"]');
    const toggleBtn = card.querySelector('[data-action="toggle-pray"]');
    const removeBtn = card.querySelector('[data-action="remove"]');

    nameInput?.addEventListener('input', (e) => {
      people[idx].name = e.target.value;
      onUpdateEntry({ ...entry });
    });

    nameInput?.addEventListener('blur', (e) => {
      if (e.target.value.trim().length > 1) {
        storage.addFrequentPerson(e.target.value.trim(), people[idx].reason);
      }
    });

    reasonInput?.addEventListener('input', (e) => {
      people[idx].reason = e.target.value;
      onUpdateEntry({ ...entry });
    });

    toggleBtn?.addEventListener('click', () => {
      people[idx].prayed = !people[idx].prayed;
      onUpdateEntry({ ...entry });
      // Refleja el estado sin re-render global (conserva el foco de los inputs)
      card.classList.toggle('prayed', people[idx].prayed);
      toggleBtn.textContent = people[idx].prayed ? '✓' : String(idx + 1);
    });

    removeBtn?.addEventListener('click', () => {
      people.splice(idx, 1);
      onUpdateEntry({ ...entry });
      rerender();
    });
  });
}
