class App {
  notes: object[];
  title: string;
  text: string;
  id: number;
  $form: Element;
  $noteTitle: Element;
  $noteText: Element;
  $formButtons: Element;
  $placeholder: Element;
  $notes: Element;
  $formCloseButton: Element;
  $modal: Element;
  $modalTitle: Element;
  $modalText: Element;
  $modalCloseButton: Element;
  $colorTooltip: Element;

  constructor() {
    this.notes = [];

    this.title = "";
    this.text = "";
    this.id = 0;

    // '$' indicates an element rather than data
    this.$form = document.querySelector("#form") as Element;
    this.$noteTitle = document.querySelector("#note-title") as Element;
    this.$noteText = document.querySelector("#note-text") as Element;
    this.$formButtons = document.querySelector("#form-buttons") as Element;
    this.$placeholder = document.querySelector("#placeholder") as Element;
    this.$notes = document.querySelector("#notes") as Element;
    this.$formCloseButton = document.querySelector("#form-close-button") as Element;
    this.$modal = document.querySelector(".modal") as Element;
    this.$modalTitle = document.querySelector(".modal-title") as Element;
    this.$modalText = document.querySelector(".modal-text") as Element;
    this.$modalCloseButton = document.querySelector(".modal-close-button") as Element;
    this.$colorTooltip = document.querySelector("#color-tooltip") as Element;

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

    this.$colorTooltip.addEventListener('mouseover', function() {
      // because used function and not arrow function,
      // 'this' refers to $colorTooltip
      this.style.display = "flex";
    })
    
    this.$colorTooltip.addEventListener('mouseout', function() {
      this.style.display = "none";
    })

    this.$colorTooltip.addEventListener("click", event => {
      const color: string = event.target.dataset.color; 
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
    const isFormClicked: boolean = this.$form.contains(event.target);
    
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
    if (event.target.matches('.toolbar-delete')) return;  

    // '.closest' goes up the tree to find the selector
    if (event.target.closest(".note")) {
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
    if (!event.target.matches(".toolbar-color")) return;
    this.id = event.target.dataset.id;
    const noteCoords = event.target.getBoundingClientRect();
    const horizontal = noteCoords.left + window.scrollX;
    const vertical = noteCoords.top + window.scrollY + 60;
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = "flex";
  }

  closeTooltip(event: Event) {
    if (!event.target.matches(".toolbar-color")) return;
    this.$colorTooltip.style.display = "none";  
  }

  selectNote(event: Event) {
    const $selectedNote: Element = event.target.closest(".note");
    if (!$selectedNote) return;
    const [ $noteTitle, $noteText ] = $selectedNote.children;
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.id = $selectedNote.dataset.id;
  }

  addNote({ title, text }) {
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
    if (!event.target.matches(".toolbar-delete")) return;
    const id: string = event.target.dataset.id;
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