export function initIntroVideo({onOpen=()=>{},onClose=()=>{}}={}) {
 const dialog=document.querySelector('#intro-video');
 const video=dialog.querySelector('video');
 let opener=null;
 document.querySelectorAll('[data-open-intro]').forEach(button=>button.addEventListener('click',()=>{
  opener=button;dialog.showModal();document.body.classList.add('intro-video-open');onOpen();
  // The full video is fetched only when someone chooses to watch it.
  if(!video.getAttribute('src')){video.src=video.dataset.src;video.load();}
  video.play().catch(()=>{/* Native playback controls remain available. */});
 }));
 dialog.querySelector('[data-close-intro]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
 dialog.addEventListener('close',()=>{video.pause();document.body.classList.remove('intro-video-open');onClose();opener?.focus({preventScroll:true});});
}
