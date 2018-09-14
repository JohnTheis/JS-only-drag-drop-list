const wrapper = document.getElementById('r58-sortable');
const sortableElements = wrapper.querySelectorAll('li');
var positions = [];

class Sortable {
    constructor () {
        for (let index = 0; index < sortableElements.length; index++) {
            const element = sortableElements[index];

            element.onmousedown = (e) => {
                this.dragMouseDown(e, element);
            };
        }
    }

    /**
     * Get mouse and element co-ordinates
     * @param {Event} e : mousedown event
     * @param {HTMLElement} element : sortable item
     */
    dragMouseDown(e, element) {
        e = e || window.event;
        e.preventDefault();

        var posTopStart = element.offsetTop;
        var posLeftStart = element.offsetLeft;
        var mouseTopStart = e.clientY;
        var mouseLeftStart = e.clientX;

        element.style.position = 'absolute';
        element.style.top = posTopStart + "px";
        element.style.left = posLeftStart + "px";

        this.createGhostElement(element);

        positions = [];

        for (let index = 0; index < sortableElements.length; index++) {
            const listElement = sortableElements[index];
            positions.push([listElement.offsetTop + 5, listElement.offsetTop - (listElement.clientHeight + 5)]);
        }

        document.onmousemove = () => {this.elementDrag(event, element, posTopStart, posLeftStart, mouseTopStart, mouseLeftStart)};
        document.onmouseup = () => this.closeDragElement(element);
    }

    /**
     * Calculates the position of the dragged element based on the mouse position vs where it started
     * @param {Event} e : Mousemove event
     * @param {HTMLElement} element : Sortable item
     * @param {Number} posTopStart : Element top offset
     * @param {Number} posLeftStart Element left offset
     * @param {Number} mouseTopStart : Mouse vertical starting position
     * @param {Number} mouseLeftStart : Mouse horizontal starting position
     */
    elementDrag(e, element, posTopStart, posLeftStart, mouseTopStart, mouseLeftStart) {
        e = e || window.event;
        e.preventDefault();

        element.style.top = posTopStart - (mouseTopStart - e.clientY) + "px";
        element.style.left = posLeftStart - (mouseLeftStart - e.clientX) + "px";

        this.setGhostPosition(posTopStart - (mouseTopStart - e.clientY));
    }

    /**
     * Sets the new position of the element within the sortable list
     * @param {HTMLElement} selectedElement
     */
    closeDragElement(selectedElement) {
        for (const element of sortableElements) {
            element.style.position = 'static';
            element.style.top = "0px";
            element.style.left = "0px";
        }

        if (document.getElementById('sortableShadow')) {
            document.getElementById('sortableShadow').insertAdjacentElement('beforebegin', selectedElement)
            document.getElementById('sortableShadow').remove();
        }

        document.onmouseup = null;
        document.onmousemove = null;
    }

    /**
     * Creates placement area for the item to be dropped into
     * @param {HTMLElement} element
     */
    createGhostElement(element) {
        const shadowMarkup = `<li id="sortableShadow">${element.innerHTML}</li>`;
        element.insertAdjacentHTML('afterend', shadowMarkup);
    }

    /**
     *
     * @param {Number} elemPosition
     */
    setGhostPosition(elemPosition) {
        for (let index = 0; index < positions.length; index++) {
            const range = positions[index];

            if (positions[index][0] >= elemPosition && positions[index][1] <= elemPosition) {
                var shadow = document.getElementById('sortableShadow');
                document.getElementById('sortableShadow').remove();

                sortableElements[index].insertAdjacentElement('beforebegin', shadow);
            }
        }


        // IndexOf one number
        // if (positions.indexOf(elemPosition) >= 0) {
        //     var shadow = document.getElementById('sortableShadow');
        //     document.getElementById('sortableShadow').remove();

        //     sortableElements[positions.indexOf(elemPosition)].insertAdjacentElement('beforebegin', shadow);
        // }
    }
}

let user = new Sortable();