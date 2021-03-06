const str = `<ul>
  <li data-time="5:17">Flexbox Video</li>
  <li data-time="8:22">Flexbox Video</li>
  <li data-time="3:34">Redux Video</li>
  <li data-time="5:23">Flexbox Video</li>
  <li data-time="7:12">Flexbox Video</li>
  <li data-time="7:24">Redux Video</li>
  <li data-time="6:46">Flexbox Video</li>
  <li data-time="4:45">Flexbox Video</li>
  <li data-time="4:40">Flexbox Video</li>
  <li data-time="7:58">Redux Video</li>
  <li data-time="11:51">Flexbox Video</li>
  <li data-time="9:13">Flexbox Video</li>
  <li data-time="5:50">Flexbox Video</li>
  <li data-time="5:52">Redux Video</li>
  <li data-time="5:49">Flexbox Video</li>
  <li data-time="8:57">Flexbox Video</li>
  <li data-time="11:29">Flexbox Video</li>
  <li data-time="3:07">Flexbox Video</li>
  <li data-time="5:59">Redux Video</li>
  <li data-time="3:31">Flexbox Video</li>
</ul>`;

// obtener el total de segundos de todos los videos del tipo 'Redux Video'
// pistas: convertirlo en objetos
// Vale por el primer parcial
// Fecha de entrega: Domingo 30 AGO 23:59
// Fecha de solucio: Miercoles 2 de SEP

// Modalidad de entrega. Pull Request.

function getObjectVideos(str){
  return str
    .replace('<ul>','')
    .replace('</ul>', '')
    .split('</li>')
    .slice(0, -1)
    .map(video => (
      {
        duracion: video
          .split('"')[1],
        tipo: video
          .split('>')[1]
      }
    ))
    .map(video => (
      {
        duracion: video.duracion
          .split(':'),
        tipo: video.tipo
      }))
    .map(video => (
      {
        duracion: parseInt(video.duracion[1]) + parseInt(video.duracion[0])*60,
        tipo: video.tipo
      }
    ))
    .filter(video => video.tipo == 'Redux Video')
    .reduce((anterior, actual) => ({duracion: anterior.duracion + actual.duracion}))
    .duracion;
    
}

//[1,2,3,5].reduce((anterior, actual) => anterior + actual); 

//console.log(getObjectVideos(str));
console.log(getObjectVideos(str) === 1847);