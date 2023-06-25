// 解决 click 事件的300ms延迟问题
FastClick.attach(document.body);

(async function () {
  //背景图旋转
  const imgbox = document.querySelector(".imgbox")
  const one = document.querySelector(".one")
  const icon = document.querySelector(".icon")
  const tow111 = document.querySelector(".tow111")
  const audioBox = document.querySelector("#audioBox")
  //歌词盒子
  const tow222 = document.querySelector(".tow222")
  let timer = null,
    wrapperList = [],
    matchNum = 0
  /*音乐控制 */
  const format = function format(time) {
    /*   console.log(time); */
    let minutes = Math.floor(time / 60),
      seconds = Math.round(time - minutes * 60)
    minutes = minutes < 10 ? "0" + minutes : "" + minutes
    seconds = seconds < 10 ? "0" + seconds : "" + seconds
    return {
      minutes,
      seconds
    }
  }
  //hangder函数
  const handle = function handle() {
    let pH = wrapperList[0].offsetHeight
    console.log(pH);
    //进度条，
    let { currentTime, duration } = audioBox
    if (isNaN(currentTime) || isNaN(duration)) return
    //播放结束
    if (currentTime >= duration) {
      playend()
      return
    }
    let { minutes: currentTimeMinutes, seconds: currentTimeSeconds } = format(currentTime),
      { minutes: durationMinutes, seconds: durationSeconds } = format(duration)
    let ratio = Math.round(currentTime / duration * 100)
    //控制歌词
    let matchs = wrapperList.filter(item => {
      let minutes = item.getAttribute("minutes")
      let seconds = item.getAttribute("seconds")
      return minutes === currentTimeMinutes && seconds === currentTimeSeconds
    })
    if (matchs.length > 0) {
      // 让匹配的段落有选中样式，移出其他的样式
      wrapperList.forEach(item => item.className = "")
      matchs.forEach(item => item.className = "active")
      //控制移动
      matchNum += matchs.length
      if (matchNum > 2) {
        let offset = (matchNum - 2) * pH
        tow222.style.transform = `translateY(${-offset}px)`
      }
    }
  }
  //结束时
  const playend = function playend() {
    clearInterval(timer)
    timer = null
    currentBox.innerHTML = "00:00"
    alreadyBox.style.width = "0%"
    tow222.style.transform = "translateY(0)"
    wrapperList.forEach(item => item.className = "")
    matchNum = 0
    player_button.className = "player_button"
  }
  /* let isPaused = true; */
  //点击播放
  one.addEventListener("click", function () {

    if (audioBox.paused) {
      audioBox.play()
      icon.style.display = "none"
      console.log(111);
      handle()
      if (!timer) timer = setInterval(handle, 1000)
      imgbox.style.animationPlayState = 'running';
      return
    }
   console.log(22);
   audioBox.pause()
 
      icon.style.display = "block"
      imgbox.className = "imgbox move"
      imgbox.style.animationPlayState = 'paused';
      clearInterval(timer)
      timer = null
    
  })
/*   document.addEventListener("touchstart", function () {
    // console.log(audioBox);
    // console.log(audioBox.pause);
    // audioBox.pause()
    // console.log(audioBox.pause);
    if (!audioBox.paused) {
      debugger
      icon.style.display = "block"
      imgbox.style.animationPlayState = 'paused'
    }

    imgbox.className = "imgbox"
    clearInterval(timer)

    timer = null
  }) */
  const bindLyric = function bindLyric(lyric) {
    let arr = []
    lyric.replace(/\[(\d+):(\d+).(?:\d+)\]([^&#?\[\]]+)\n/g, (value, $1, $2, $3) => {
      arr.push({
        minutes: $1,
        seconds: $2,
        text: $3
      })
    })
    //绑歌词
    let str = ``
    arr.forEach(({ minutes, seconds, text }) => {
      str += `<p  class="active" minutes="${minutes}" seconds="${seconds}"> ${text}</p>`
    })
    tow222.innerHTML = str
    wrapperList = Array.from(tow222.querySelectorAll("p"))
  }
  const binding = function binding(data) {
    let { title, duration, pic, audio, lyric, Wording, music } = data
  /*   audioBox.src = audio */
    imgbox.innerHTML = `
  <img class="imgess" src="${pic}" alt="">
  `
    tow111.innerHTML = `
  <h2>
 ${title}
</h2>
  `
    //绑定歌词
    bindLyric(lyric)
  }
  //先服务器发请求获取数据
  try {
    let { code, data } = await API.queryLyric()
    if (+code === 0) {
      //请求成功，网络层和业务层都成功

      binding(data)

      return
    }
  } catch (error) { }
  //请求失败
  alert("网络繁忙,请刷新")
})()