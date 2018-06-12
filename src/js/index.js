import Defender from './Defender.js';
import Stage from './Stage.js';
import Controls from './Controls.js'
import SpaceShip from './SpaceShip.js'; 
import Spot from './components/Spot.js'; 
import { calcCenter, clear, hover, isOverLapping, getRandomInt } from './utils/index.js';
const intViewportWidth = window.innerWidth;
const intViewportHeight = window.innerHeight;
const canvas = document.getElementById('lienzo');
const canvasHeight = canvas.height = intViewportHeight;
const canvasWidth = canvas.width = intViewportWidth;
const ctx = canvas.getContext('2d');


class Universe {
  constructor() {    
    this.FPS = 1000 / 60;
  }

  render() {
    let game = setInterval(() => {
      clear(canvas);  
      ctx.save();   
      ctx.beginPath();      
      ctx.lineTo(canvas.width/2, 0);
      ctx.lineTo(canvas.width/2, canvas.height);
      ctx.moveTo(0, canvas.height/2);
      ctx.lineTo(canvas.width, canvas.height/2);
      ctx.strokeStyle = 'white';
      ctx.stroke();
      ctx.closePath();       
      ctx.restore();
      this.update();
    }, this.FPS)
  }
  
  update() {
    this.stage.render();
    this.controls.render();
  }

  moveEvent(handler) {
    let momentumX = handler.x - handler.pivot.x;
    let momentumY = handler.y - handler.pivot.y;    
    let nav1 = this.stage.find('nav1');
    nav1.prevX = nav1.x;
    nav1.prevY = nav1.y;
    nav1.x += momentumX/10;
    nav1.y += momentumY/10;
    nav1.bound = true;

    let nav2 = this.stage.find('nav2');
    nav2.prevX = nav2.x+100;
    nav2.prevY = nav2.y+50;
    nav2.x += momentumX/10;
    nav2.y += momentumY/10;
    nav2.bound = true;

  }

  updateAngle(clientX, clientY) {
    let convertX = clientX - canvas.width/2;
    let convertY = canvas.height/2 - clientY;
     let nav1 = this.stage.find('nav1');      
     let nav2 = this.stage.find('nav2'); 
     let info = this.stage.find('info');     
     var rad = Math.atan2(convertX, convertY);
     var deg = rad * (180 / Math.PI);
     console.log( `rad: ${ rad }, deg: ${ deg }, x: ${ convertX }, y: ${ convertY }`);     
     info.data = `deg: ${ Math.floor(deg) }, x: ${ clientX }, y: ${ clientY }`;
     nav1.angle = deg;
     nav2.angle = deg; 
  }

  preload() {
    this.stage = new Stage(canvas, true);
    let nav1 = new SpaceShip({width: 25, height: 25, x: 150, y: 200, ctx, color: 'white', id: 'nav1' });
    let nav2 = new SpaceShip({width: 25, height: 25, x: 150, y: 200, ctx, color: 'white', id: 'nav2' });
    this.stage.push(nav1);
    this.stage.push(nav2);
    let onMove = this.moveEvent.bind(this);
    this.controls = new Controls({stage: this.stage, canvas, onMove}, true);
    canvas.addEventListener("touchstart", e => {
      let { clientX, clientY } = e.targetTouches[0];
      this.randomPoints(clientX, clientY);
      this.updateAngle(clientX, clientY);
    });
  }

  randomPoints(x, y) {
    let spot = new Spot({x, y, ctx, display: true, size: 10});
    this.stage.layers.push(spot);
  }
}


let space = new Universe();
space.preload();
space.render();
/*
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function (err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}
*/
