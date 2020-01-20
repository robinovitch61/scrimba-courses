function getNotNullHTMLInputElement(selector: string): HTMLInputElement {
  let elem = document.querySelector(selector);
  if (!(elem instanceof HTMLInputElement)) {
    throw TypeError(`'${selector}' returned null rather than HTMLInputElement!`);
  }
  return elem;
}

function isHTMLInputElement(event: any) {
  if (!(event.target instanceof HTMLInputElement)) {
    throw TypeError("Event returned non-HTMLInputElement!");
  }
  return event.target;
}

interface Note {
  id: number,
  title: string,
  text: string,
  color: string,
}

class App {
  notes: Note[];
  title: string;
  text: string;
  id: number;
  $form: HTMLInputElement;
  $noteTitle: HTMLInputElement;
  $noteText: HTMLInputElement;
  $formButtons: HTMLInputElement;
  $placeholder: HTMLInputElement;
  $notes: HTMLInputElement;
  $formCloseButton: HTMLInputElement;
  $modal: HTMLInputElement;
  $modalTitle: HTMLInputElement;
  $modalText: HTMLInputElement;
  $modalCloseButton: HTMLInputElement;
  $colorTooltip: HTMLInputElement;

  constructor() {
    this.notes = [];

    this.title = "";
    this.text = "";
    this.id = 0;

    // '$' indicates an HTMLInputElement rather than data
    this.$form = getNotNullHTMLInputElement("#form");
    this.$noteTitle = getNotNullHTMLInputElement("#note-title");
    this.$noteText = getNotNullHTMLInputElement("#note-text");
    this.$formButtons = getNotNullHTMLInputElement("#form-buttons");
    this.$placeholder = getNotNullHTMLInputElement("#placeholder");
    this.$notes = getNotNullHTMLInputElement("#notes");
    this.$formCloseButton = getNotNullHTMLInputElement("#form-close-button");
    this.$modal = getNotNullHTMLInputElement(".modal");
    this.$modalTitle = getNotNullHTMLInputElement(".modal-title");
    this.$modalText = getNotNullHTMLInputElement(".modal-text");
    this.$modalCloseButton = getNotNullHTMLInputElement(".modal-close-button");
    this.$colorTooltip = getNotNullHTMLInputElement("#color-tooltip");

    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener("click", event => {
      this.handleFormClick(event);
      this.selectNote(event);
      this.openModal(event);
      this.deleteNote(event);
    });

    document.body.addEventListener('mouseover', event => {
      this.openTooltip(event);
    });

    document.body.addEventListener('mouseout', event => {
      this.closeTooltip(event);
    });

    this.$colorTooltip.addEventListener('mouseover', function(this: HTMLInputElement) {
      // because used function and not arrow function,
      // 'this' refers to $colorTooltip
      this.style.display = "flex";
    })
    
    this.$colorTooltip.addEventListener('mouseout', function() {
      this.style.display = "none";
    })

    this.$colorTooltip.addEventListener("click", event => {
      const color: string = isHTMLInputElement(event.target).dataset.color; 
      if (color) {
        this.editNoteColor(color);  
      }
   })

    this.$form.addEventListener("submit", event => {
      // prevent default of page reloading
      event.preventDefault(); 
      const title: string = this.$noteTitle.value;
      const text: string = this.$noteText.value;
      const hasNote = title || text;

      if (hasNote) {
        this.addNote({ title, text });
      }
    });

    this.$formCloseButton.addEventListener("click", event => {
      // stop actions by further event listeners
      event.stopPropagation();
      this.closeForm();
    });

    this.$modalCloseButton.addEventListener("click", event => {
      this.closeModal(event);
    });
  }

  handleFormClick(event: Event) {
    const isFormClicked: boolean = this.$form.contains(isHTMLInputElement(event.target));
    
    const title: string = this.$noteTitle.value;
    const text: string = this.$noteText.value;
    const hasNote: boolean = title.length > 0 || text.length > 0;

    if (isFormClicked) {
      this.openForm();
    } else if (hasNote) {
      this.addNote({ title, text });
    } else {
      this.closeForm();
    }
  }

  openForm() {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$formButtons.style.display = 'block';
  }

  closeForm() {
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.display = 'none';
    this.$formButtons.style.display = 'none';
    this.$noteTitle.value = '';
    this.$noteText.value = '';
  }

  toggleModalVisibility() {
    this.$modal.classList.toggle("open-modal");
  }

  openModal(event: Event) {
    if (isHTMLInputElement(event.target).matches('.toolbar-delete')) return;  

    // '.closest' goes up the tree to find the selector
    if (isHTMLInputElement(event.target).closest(".note")) {
      this.toggleModalVisibility();
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
    }
  }

  closeModal(event: Event) {
    this.editNote();
    this.toggleModalVisibility();
  }

  openTooltip(event: Event) {
    if (!isHTMLInputElement(event.target).matches(".toolbar-color")) return;
    this.id = isHTMLInputElement(event.target).dataset.id;
    const noteCoords = isHTMLInputElement(event.target).getBoundingClientRect();
    const horizontal = noteCoords.left + window.scrollX;
    const vertical = noteCoords.top + window.scrollY + 60;
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = "flex";
  }

  closeTooltip(event: Event) {
    if (!isHTMLInputElement(event.target).matches(".toolbar-color")) return;
    this.$colorTooltip.style.display = "none";  
  }

  selectNote(event: Event) {
    const $selectedNote: Note = isHTMLInputElement(event.target).closest(".note");
    if (!$selectedNote) return;
    const $noteTitle = isHTMLInputElement($selectedNote.children[0]);
    const $noteText = isHTMLInputElement($selectedNote.children[1]);
    // const [ $noteTitle, $noteText ] = $selectedNote.children[1];
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.id = $selectedNote.dataset.id;
  }

  addNote({ title, text }: {title: string, text:string}) {
    const newNote = {
      title,
      text,
      color: "white",
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 0,
    }
    this.notes = [...this.notes, newNote];
    this.render();
  }

  editNote() {
    const title = this.$modalTitle.value;
    const text = this.$modalText.value;
    this.notes = this.notes.map(note => 
      note.id === Number(this.id) ? { ...note, title, text } : note
    );
    this.render();
  }

  editNoteColor(color: string) {
    this.notes = this.notes.map(note =>
      note.id === Number(this.id) ? { ...note, color } : note
    );
    this.render();
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? 'none' : 'flex';
    const htmlNotes = this.createHtmlNotes();
    this.$notes.innerHTML = htmlNotes;
    this.closeForm();
  }

  createHtmlNotes() {
    return this.notes.map(note => `
      <div style="background: ${note.color};" class="note", data-id="${note.id}">
        <div class="${note.title && 'note-title'}">${note.title}</div>
        <div class="note-text">${note.text}</div>
        <div class="toolbar-container">
          <div class="toolbar">
            <img class="toolbar-color" data-id=${note.id} src="https://icon.now.sh/palette">
            <img class="toolbar-delete" data-id=${note.id} src="https://icon.now.sh/delete">
          </div>
        </div>
      </div>
    `).join("")
  }

  deleteNote(event: Event) {
    event.stopPropagation();
    if (!isHTMLInputElement(event.target).matches(".toolbar-delete")) return;
    const id: string = isHTMLInputElement(event.target).dataset.id;
    this.notes = this.notes.filter(note => note.id !== Number(id));
    this.render();
  }

  saveNotes() {
    // localStorage.setItem("notes", JSON.stringify(this.notes));
  }

  render() {
    this.saveNotes();
    this.displayNotes();  
  }
}

new App();