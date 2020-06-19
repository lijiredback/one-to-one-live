# one-to-one-live

1-to-1 live system base on WebRTC 

## 实现1对1音视频通话过程

+ 两个 WebRTC 终端：负责音视频采集、编解码、NAT 穿越、音视频数据传输
+ 一个 Signal（信令）服务器：负责信令处理，如加入房间、离开房间、媒体协商消息的传递等
+ 一个 STUN/TURN 服务器：负责获取 WebRTC 终端在公网的 IP 地址，以及 NAT 穿越失败后的数据中转


## WebRTC 进行音视频通话的大体过程

+ WebRTC 终端进入房间之前，首先检测设备是否可用。如果可用，则进行**音视频数据采集**。
+ 采集到的数据
  - 预览：自己看到自己的视频
  - 录制下来保存为文件，视频通话结束后，上传到服务器让用户回看
+ 获取音视频数据就绪后，WebRTC 终端要发送 **“加入”** 信令到 Signal 服务器
+ Signal 服务器收到该消息后，会创建房间
+ 另一个 WebRTC 终端，加入房间
+ 第一个 WebRTC 终端将创建 **“媒体连接”对象（RTCPeerConnection）**，并将采集到的音视频数据通过 RTCPeerConnection 对象进行编码，通过 P2P 传送给对端
+ 进行 P2P 穿越可能会失败。为了保证失败时，音视频数据仍然互通，需要通过 TURN 服务器进行音视频数据中转
+ 音视频数据到达对端后，对端首先将收到的音视频数据进行解码，然后将其展现。（一端到另一端的单通）

## 音视频采集基本概念

+ 摄像头(camera)：捕捉（采集）图像和视频
+ 帧率（Frame per Second，FPS）：**摄像头一秒中采集图像的次数称为帧率。**帧率越高，视频就越流畅。但直播中，帧率越高，占的网络带宽越多
+ 分辨率（resolution）：分辨率越高图像越清晰，占的带宽也越多。直播中，分辨率会根据网络带宽动态调整。2K、1080P、720P...
+ 宽高比：分辨率一般两种宽高比, 16:9 或 4:3
+ 麦克风(microphone)：采集音频数据。一秒内采样的次数称为 **采样率**。每个采样用几个 bit 表示，称为 **采样位深或采样大小**
+ 轨(track)：**每条轨数据都是独立的，不会与其他轨相交，**如音频轨、视频轨
+ 流(stream)：可以理解为容器，WebRTC 中分为
  - 媒体流(MediaStream)：存放 0 个或多个音频轨或视频轨
  - 数据流(DataStream)：存放 0 个或多个数据轨

## 音视频采集

+ getUserMedia()
```
let promise = navigator.mediaDevices.getUserMedia(constraints);
// success: mediaStream
// fail: PermissionDeniedError（拒绝 API 访问） 或 NotFoundError（设备不可用）
```