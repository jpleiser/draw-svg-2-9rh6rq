import { Component } from '@angular/core';

@Component({
  selector: 'draw-layer',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {

  constructor() {
    // this.addShape('rect');
  }

  addShape(shape: string) {
    let drawLayer = document.getElementById('drawingLayer');
    let svgContainer;
    let toggle = true;
    let mouseDown = false;
    let svgShape;
    let clickX;
    let clickY;

    // change cursor to crosshair when mouse is hovering over svg
    drawLayer.addEventListener('mouseover', e => {
      if (toggle) {
        drawLayer.style.cursor = 'crosshair';
      }
    });

    drawLayer.addEventListener('mousedown', e => {
      if (toggle) {
        mouseDown = true;
        clickX = e.pageX;
        clickY = e.pageY;
        svgContainer = document.createElement('div');
        svgContainer.setAttribute('id', 'svgContainer');
        svgContainer.style.position = 'absolute';
        svgContainer.style.display = 'flex'; // VERY IMPORTANT NEED FOR SMALL SHAPE
        svgContainer.style.left = `${clickX}px`;
        svgContainer.style.top = `${clickY}px`;
        svgContainer.style.width = 0;
        svgContainer.style.height = 0;
        svgContainer.style.outline = '1px dotted black';
        svgContainer.innerHTML = this.createShape(shape, 'blue');
        drawLayer.appendChild(svgContainer);
      }
    });

    drawLayer.addEventListener('mousemove', e => {
      if (toggle && mouseDown) {
        if (shape === "line") {
          let line = document.getElementById('line');
          if (e.pageX < clickX) { // drag left of click
            line.setAttributeNS(null, 'x1', '100%');
            line.setAttributeNS(null, 'x2', '0%');
          } else { // drag right of click
            line.setAttributeNS(null, 'x1', '0%');
            line.setAttributeNS(null, 'x2', '100%');
          }
          if (e.pageY < clickY) { // drag above click
            line.setAttributeNS(null, 'y1', '100%');
            line.setAttributeNS(null, 'y2', '0%');
          } else { // drag below click
            line.setAttributeNS(null, 'y1', '0%');
            line.setAttributeNS(null, 'y2', '100%');
          }
        }

        if (e.pageX < clickX) {
          svgContainer.style.left = `${e.pageX}px`;
        }
        if (e.pageY < clickY) {
          svgContainer.style.top = `${e.pageY}px`;
        }
        svgContainer.style.width = `${Math.abs(e.pageX - clickX)}px`;
        svgContainer.style.height = `${Math.abs(e.pageY - clickY)}px`;
      }
    });

    drawLayer.addEventListener('mouseup', e => {
      if (toggle) {
        if (shape === 'line') {
          document.getElementById('line').setAttributeNS(null, 'id', '');
        }
        toggle = false;
        mouseDown = false;
        drawLayer.style.cursor = 'default';
        svgContainer.style.outline = 'none';
      }
    });

    drawLayer.addEventListener('mouseleave', e => {
      if (toggle && svgContainer) {
        if (shape === 'line') {
          document.getElementById('line').setAttributeNS(null, 'id', '');
        }
        toggle = false;
        drawLayer.style.cursor = 'default';
        mouseDown = false;
        svgContainer.style.outline = '';
      }
    });
  }

  createShape(shape: string, fill: string) {
    let shapeHTML;
    switch(shape) {
      case 'rect': {
        shapeHTML = `<${shape} x='0' y='0' width='100%' height='100%' fill='${fill}'/>`;
        break;
      }
      case 'line': {
        shapeHTML = `<${shape} x1='0' y1='0' x2='100%' y2='100%' stroke='${fill}' id="line"/>`;
        break;
      }
      case 'ellipse': {
        shapeHTML = `<${shape} cx='50%' cy='50%' rx='50%' ry='50%' fill='${fill}'/>`;
        break;
      }
    }
    let innerHtml = `<svg height="100%" width="100%">${shapeHTML}</svg>`
    return innerHtml;
  }
}