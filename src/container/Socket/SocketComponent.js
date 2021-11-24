import React, { Component } from 'react';
import { Input,Button, message,Upload } from 'antd';
import './index.css';
import WebSocket from '../../utils/WebSocket';


var SRecorder = function(stream) {
    let config = {};
 
    config.sampleBits = 16;             //输出采样位数
    config.sampleRate = 8000;   //输出采样频率
 
    var context = new AudioContext();

    var audioInput = null;
    if(stream){
        audioInput = context.createMediaStreamSource(stream);
    }
    var recorder = context.createScriptProcessor(4096, 1, 1); //录音缓冲区大小，输入通道数，输出通道数
 
    var audioData = {
        size: 0          //录音文件长度
        , buffer: []    //录音缓存
        , inputSampleRate: context.sampleRate    //输入采样率
        , inputSampleBits: 16      //输入采样数位 8, 16
        , outputSampleRate: config.sampleRate    //输出采样率
        , oututSampleBits: config.sampleBits      //输出采样数位 8, 16
        , clear: function(){
            this.buffer = [];
            this.size = 0;
        }
        , input: function(data) {
            this.buffer.push(new Float32Array(data));
            this.size += data.length;
        }
        , compress: function() { //合并压缩
            //合并
            var data = new Float32Array(this.size);
            var offset = 0;
            for (var i = 0; i < this.buffer.length; i++) {
                data.set(this.buffer[i], offset);
                offset += this.buffer[i].length;
            }
            //压缩
            var compression = parseInt(this.inputSampleRate / this.outputSampleRate);
            var length = data.length / compression;
            var result = new Float32Array(length);
            var index = 0, j = 0;
            while (index < length) {
                result[index] = data[j];
                j += compression;
                index++;
            }
            return result;
        }
        , encodeWAV: function() {
            var sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
            var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
            var bytes = this.compress();
            var dataLength = bytes.length * (sampleBits / 8);
            var buffer = new ArrayBuffer(44 + dataLength);
            var data = new DataView(buffer);
 
            var channelCount = 1;//单声道
            var offset = 0;
 
            var writeString = function(str) {
                for (var i = 0; i < str.length; i++) {
                    data.setUint8(offset + i, str.charCodeAt(i));
                }
            };
            
            // 资源交换文件标识符
            writeString('RIFF'); offset += 4;
            // 下个地址开始到文件尾总字节数,即文件大小-8
            data.setUint32(offset, 36 + dataLength, true); offset += 4;
            // WAV文件标志
            writeString('WAVE'); offset += 4;
            // 波形格式标志
            writeString('fmt '); offset += 4;
            // 过滤字节,一般为 0x10 = 16
            data.setUint32(offset, 16, true); offset += 4;
            // 格式类别 (PCM形式采样数据)
            data.setUint16(offset, 1, true); offset += 2;
            // 通道数
            data.setUint16(offset, channelCount, true); offset += 2;
            // 采样率,每秒样本数,表示每个通道的播放速度
            data.setUint32(offset, sampleRate, true); offset += 4;
            // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
            data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true); offset += 4;
            // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
            data.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
            // 每样本数据位数
            data.setUint16(offset, sampleBits, true); offset += 2;
            // 数据标识符
            writeString('data'); offset += 4;
            // 采样数据总数,即数据总大小-44
            data.setUint32(offset, dataLength, true); offset += 4;
            // 写入采样数据
            if (sampleBits === 8) {
                for (var i = 0; i < bytes.length; i++, offset++) {
                    var s = Math.max(-1, Math.min(1, bytes[i]));
                    var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
                    val = parseInt(255 / (65535 / (val + 32768)));
                    data.setInt8(offset, val, true);
                }
            } else {
                for (var i = 0; i < bytes.length; i++, offset += 2) {
                    var s = Math.max(-1, Math.min(1, bytes[i]));
                    data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                }
            }
            // return new Blob([data], { type: 'audio/wav' });
            return data.buffer;
        }
    };
 
    this.start = () => {
        audioInput.connect(recorder);
        recorder.connect(context.destination);
    }
 
    this.stop = () => {
        recorder.disconnect();
    }
 
    this.getBlob = () => {
        return audioData.encodeWAV();
    }
 
    this.clear = () => {
        audioData.clear();
    }

    this.get = (callback) => {
        if (callback) {
            if (navigator.mediaDevices) {
                navigator.mediaDevices.getUserMedia(
                    { audio: true }).then(
                        (stream) => {
                            var rec = new SRecorder(stream);
                            callback(rec);
                        })
            }
        }
    }
    recorder.onaudioprocess = (e) => {
        audioData.input(e.inputBuffer.getChannelData(0));
    }
};


class SocketComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            messageList: [],
            audioFile: null
        };
    }
    
    addWavHeader(samples, sampleRateTmp, sampleBits, channelCount) {
        let dataLength = samples.byteLength;
        /* 新的buffer类，预留44bytes的heaer空间 */
        let buffer = new ArrayBuffer(44 + dataLength);
        /* 转为 Dataview, 利用API来填充字节 */
        let view = new DataView(buffer);
        let offset = 0;
        /* ChunkID, 4 bytes,  资源交换文件标识符 */
        this.writeString(view, offset, 'RIFF'); offset += 4;
        /* ChunkSize, 4 bytes, 下个地址开始到文件尾总字节数,即文件大小-8 */
        view.setUint32(offset, /* 32 */ 36 + dataLength, true); offset += 4;
        /* Format, 4 bytes, WAV文件标志 */
        this.writeString(view, offset, 'WAVE'); offset += 4;
        /* Subchunk1 ID, 4 bytes, 波形格式标志 */
        this.writeString(view, offset, 'fmt '); offset += 4;
        /* Subchunk1 Size, 4 bytes, 过滤字节,一般为 0x10 = 16 */
        view.setUint32(offset, 16, true); offset += 4;
        /* Audio Format, 2 bytes, 格式类别 (PCM形式采样数据) */
        view.setUint16(offset, 1, true); offset += 2;
        /* Num Channels, 2 bytes,  通道数 */
        view.setUint16(offset, channelCount, true); offset += 2;
        /* SampleRate, 4 bytes, 采样率,每秒样本数,表示每个通道的播放速度 */
        view.setUint32(offset, sampleRateTmp, true); offset += 4;
        /* ByteRate, 4 bytes, 波形数据传输率 (每秒平均字节数) 通道数×每秒数据位数×每样本数据位/8 */
        view.setUint32(offset, sampleRateTmp * channelCount * (sampleBits / 8), true); offset += 4;
        /* BlockAlign, 2 bytes, 快数据调整数 采样一次占用字节数 通道数×每样本的数据位数/8 */
        view.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
        /* BitsPerSample, 2 bytes, 每样本数据位数 */
        view.setUint16(offset, sampleBits, true); offset += 2;
        /* Subchunk2 ID, 4 bytes, 数据标识符 */
        this.writeString(view, offset, 'data'); offset += 4;
        /* Subchunk2 Size, 4 bytes, 采样数据总数,即数据总大小-44 */
        view.setUint32(offset, dataLength, true); offset += 4;
        if (sampleBits === 16) {
          this.floatTo16BitPCM(view, samples);
            // for (var i = 0; i < samples.length; i++, offset += 2) {
            //     var s = Math.max(-1, Math.min(1, samples[i]));
            //     view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            // }
        } else if (sampleBits === 8) {
          this.floatTo8BitPCM(view, samples);
        } else {
          this.floatTo32BitPCM(view, samples);
        }
        // return new Blob([view], { type: 'audio/wav' });
        return view.buffer
    }

    writeString(view, offset, string) {
        for (let i = 0; i < string.length; i += 1) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
    floatTo32BitPCM(output, input) {
        const oinput = new Int32Array(input);
        let newoffset = 44;
        for (let i = 0; i < oinput.length; i += 1, newoffset += 4) {
          output.setInt32(newoffset, oinput[i], true);
        }
    }
    floatTo16BitPCM(output, input) {
        const oinput = new Int16Array(input);
        let newoffset = 44;
        for (let i = 0; i < oinput.length; i += 1, newoffset += 2) {
          output.setInt16(newoffset, oinput[i], true);
        }
    }
    floatTo8BitPCM(output, input) {
        const oinput = new Int8Array(input);
        let newoffset = 44;
        for (let i = 0; i < oinput.length; i += 1, newoffset += 1) {
          output.setInt8(newoffset, oinput[i], true);
        }
    }

    gRecorder = null;
    door = false;
    audioSource = null;
    bufferList = []
    componentDidMount(){
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        new SRecorder().get((rec)=>{
            this.gRecorder = rec;
        })
        this.audio = document.querySelector('audio');
        let bufferLists = [];
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)({sampleRate: 8000});
        this.socket = new WebSocket({
            socketUrl: 'ws://192.168.52.216:32311/webSocket/alarm-voice',
            timeout: 5000,
            socketMessage: (reponse) => {
                console.log('get message',reponse);  //后端返回的数据，渲染页面
                if (reponse.data instanceof Blob) {
                    let reader = new FileReader();
                    reader.onload = (e)=>{
                        if(e.target.readyState == FileReader.DONE){
                            let bufer = e.srcElement.result;
                            this.bufferList.push(bufer)
                            let blob = this.addWavHeader(bufer, 8000,16, 1);
                            audioCtx.decodeAudioData(blob).then((buffer)=> {
                                let source = audioCtx.createBufferSource();
                                source.buffer = buffer;
                                source.connect(audioCtx.destination);
                                source.loop = false;
                                source.start(0);
                            }).catch((e)=>{
                                console.log('failed to decode the file',e);
                            });
                        }
                    }
                    reader.readAsArrayBuffer(reponse.data);
                }else if(reponse.data instanceof ArrayBuffer){
                    const bufer = reponse.data
                    this.bufferList.push(bufer)
                    if(bufferLists.length == 20){
                        let bufers = this.concatenate(bufferLists);
                        let blob = this.addWavHeader(bufers, 8000,16, 1);
                        audioCtx.decodeAudioData(blob).then((buffer)=> {
                            let source = audioCtx.createBufferSource();
                            source.buffer = buffer;
                            source.connect(audioCtx.destination);
                            source.loop = false;
                            source.start(0);
                        }).catch((e)=>{
                            console.log('failed to decode the file',e);
                        });
                        bufferLists = [bufer]
                    }else {
                        bufferLists.push(bufer);
                    }
                }
            },
            socketClose: (msg) => {
                console.log(msg);
            },
            socketError: () => {
                console.log(this.state.taskStage + '连接建立失败');
            },
            socketOpen: () => {
                console.log('连接建立成功');
                // 心跳机制 定时向后端发数据
                // this.taskRemindInterval = setInterval(() => {
                //     this.socket.sendMessage({ "msgType": 0 })
                // }, 30000)
            }
        })

        document.onkeydown = (e) => {
            if(e.keyCode === 65) {
                if(!this.door) {
                    this.gRecorder.start();
                    this.recordTimer = setInterval(() => {
                        this.recordList.push(this.gRecorder.getBlob())
                        this.socket.sendMessage(this.gRecorder.getBlob(), true);
                        this.gRecorder.clear();
                    }, 500);
                    this.door = true;
                }
            }
        };
    
        // document.onkeyup = (e) => {
        //     if(e.keyCode === 65) {
        //         if(this.door) {
        //             this.recordList = this.gRecorder.getBlob()
        //             // this.socket.sendMessage(this.gRecorder.getBlob());
        //             this.gRecorder.clear();
        //             this.gRecorder.stop();
        //             this.door = false;
        //         }
        //     }
        // }
    }
    recordList = [];
    receive(e) {
        this.audio.src = window.URL.createObjectURL(e);
    }

    componentWillUnmount(){
        this.socket.closeSocket()
    }

    submitMessage(){
        if(!this.state.inputValue){
            message.warning('请输入内容')
            return;
        }
        this.socket.sendMessage(this.state.inputValue)
    }

    playClick(){
        const {audioFile} = this.state;
        let reader = new FileReader();
        reader.onload = (e)=>{
            if(e.target.readyState == FileReader.DONE){
                let audioCtx = new (window.AudioContext || window.webkitAudioContext)({sampleRate: 8000});
                let bufer = e.srcElement.result;
                let blob = this.addWavHeader(bufer, 8000,16, 1);
                audioCtx.decodeAudioData(blob).then((buffer)=> {
                    let source = audioCtx.createBufferSource();
                    console.log(buffer);
                    source.buffer = buffer;
                    source.connect(audioCtx.destination);
                    source.loop = false;
                    source.start(0);
                }).catch((e)=>{
                    console.log('failed to decode the file',e);
                });
            }
        }
        reader.readAsArrayBuffer(audioFile);
    }

    concatenate(arrays) {
            let totalLen = 0;
            for (let arr of arrays)
                totalLen += arr.byteLength;
            let res = new Uint8Array(totalLen)
            let offset = 0
            for (let arr of arrays) {
                let uint8Arr = new Uint8Array(arr)
                res.set(uint8Arr, offset)
                offset += arr.byteLength
            }
            return res.buffer
    }

    playFile(){
        console.log(this.bufferList);
        let bufer = this.concatenate(this.bufferList)
        let blob = this.addWavHeader(bufer, 8000,16, 1);
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)({sampleRate: 8000});
        audioCtx.decodeAudioData(blob).then((buffer)=> {
            console.log(buffer);
            let source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            source.loop = false;
            source.start(0);
        }).catch((e)=>{
            console.log('failed to decode the file',e);
        });
    }

    playRecord(){
        let bufer = this.concatenate(this.recordList)
        let blob = this.addWavHeader(bufer, 8000,16, 1);
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)({sampleRate: 8000});
        audioCtx.decodeAudioData(blob).then((buffer)=> {
            console.log(buffer);
            let source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            source.loop = false;
            source.start(0);
        }).catch((e)=>{
            console.log('failed to decode the file',e);
        });
    }

    stopRecord(){
        this.recordTimer && clearInterval(this.recordTimer)
        this.gRecorder.clear();
        this.gRecorder.stop();
    }

    render() {
        const {inputValue, messageList,audioFile} = this.state;
        const props = {
            name: 'resource',
            accept: '.mp3,.pcm',
            showUploadList: false,
            listType: 'audio',
            beforeUpload:(file)=>{
            },
            customRequest: (option)=>{
                this.setState({
                    audioFile: option.file,
                })
            },
        };
        const uploadButton = (
            <div style={{fontSize: '14px', color:'#000'}}>
                <span>选择音频</span>
            </div>
        );
        return (
            <div className="socket_container">
                <audio style={{width: '200px', height: '50px'}} autoPlay type="audio/wav" controls id="audio"></audio>
                <Button
                type="primary"
                onClick={()=>{
                    this.socket.connection();
                }}
                style={{marginBottom: '20px'}}
                >连接</Button>


                
                <Button
                type="primary"
                onClick={()=>{
                    this.socket.closeSocket()
                }}
                style={{marginBottom: '20px'}}
                >断开连接</Button>
                <div className="row_center">
                    <Input
                        value={inputValue}
                        onChange={(e)=>{
                            this.setState({
                                inputValue: e.target.value
                            })
                        }}
                        style={{width: '150px',marginRight: '20px'}}
                    />
                    <Button
                        type="primary"
                        onClick={()=>{
                            this.submitMessage()
                        }}
                    >提交</Button>
                </div>

                <div style={{display:"flex", alignItems:'center'}}>
                    <Upload {...props}>
                        {audioFile ?
                        <div style={{fontSize: '14px', color: '#000'}}>{audioFile.name}</div>:
                        uploadButton}
                    </Upload>
                    <Button
                    type="primary"
                    onClick={()=>{
                        this.playClick()
                    }}
                    style={{marginBottom: '20px'}}
                    >播放</Button>
                </div>
                
                <Button
                    type="primary"
                    onClick={()=>{
                        this.playFile()
                    }}
                    style={{marginBottom: '20px'}}
                    >播放文件</Button>
                <Button
                type="primary"
                onClick={()=>{
                    this.playRecord()
                }}
                style={{marginBottom: '20px'}}
                >播放录音</Button>
                
                <Button
                type="primary"
                onClick={()=>{
                    this.stopRecord()
                }}
                style={{marginBottom: '20px'}}
                >停止录音</Button>
                <div style={{marginTop: '20px'}}>接收的消息</div>
                <div style={{display:'flex', flexDirection:'column',}}>
                    <div style={{fontSize: '12px', color: 'red'}}></div>
                </div>
            </div>
        );
    }
}

export default SocketComponent;
