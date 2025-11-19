import React, { useEffect, useRef, useState } from "react";
import { socket } from "@/socket"; // your existing socket instance
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

export default function VideoCall() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const madeOfferRef = useRef(false); // prevents duplicate offers

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  // ---------------------------------------------------
  // 1. JOIN ROOM & START CAMERA
  // ---------------------------------------------------
  useEffect(() => {
    async function startCall() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;

        socket.emit("join-call", roomId);
      } catch (err) {
        console.error("Media error", err);
        alert("Camera/microphone access denied");
      }
    }

    startCall();
  }, [roomId]);

  // ---------------------------------------------------
  // 2. REGISTER SOCKET EVENTS
  // ---------------------------------------------------
  useEffect(() => {
    socket.on("user-joined", handleUserJoined);
    socket.on("webrtc-offer", handleReceiveOffer);
    socket.on("webrtc-answer", handleReceiveAnswer);
    socket.on("webrtc-candidate", handleReceiveCandidate);
    socket.on("call-ended", handleEndCallSignal);

    return () => {
      socket.off("user-joined");
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("webrtc-candidate");
      socket.off("call-ended");
    };
  }, []);

  // ---------------------------------------------------
  // 3. CREATE PEER CONNECTION
  // ---------------------------------------------------
  async function createPeerConnection() {
    if (peerConnectionRef.current) return;

    peerConnectionRef.current = new RTCPeerConnection(config);

    // Send local tracks
    localStreamRef.current.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, localStreamRef.current);
    });

    // Receive remote track
    peerConnectionRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // Send ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };
  }

  // ---------------------------------------------------
  // 4. OFFER/ANSWER LOGIC
  // ---------------------------------------------------
  async function handleUserJoined() {
    await createPeerConnection();

    if (madeOfferRef.current) return; // avoid double offers
    madeOfferRef.current = true;

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    socket.emit("webrtc-offer", { roomId, offer });
  }

  async function handleReceiveOffer(offer) {
    await createPeerConnection();

    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    socket.emit("webrtc-answer", { roomId, answer });
  }

  async function handleReceiveAnswer(answer) {
    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }

  async function handleReceiveCandidate(candidate) {
    try {
      await peerConnectionRef.current.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (err) {
      console.error("Error adding ICE candidate:", err);
    }
  }

  // ---------------------------------------------------
  // 5. END CALL
  // ---------------------------------------------------
  function handleEndCallSignal() {
    endCall(true);
  }

  function endCall(fromRemote = false) {
    try {
      peerConnectionRef.current?.close();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    } catch {}

    peerConnectionRef.current = null;

    if (!fromRemote) {
      socket.emit("end-call", roomId);
    }

    // ⬅ Redirect patient or provider accordingly
    const role = localStorage.getItem("role");

    if (role === "provider") navigate("/appointments/provider");
    else navigate("/appointments/patient");
  }

  // ---------------------------------------------------
  // 6. CAMERA/MIC TOGGLES
  // ---------------------------------------------------
  function toggleCamera() {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  }

  function toggleMic() {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  }

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
        <div className="bg-black rounded-xl overflow-hidden flex items-center justify-center">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-black rounded-xl overflow-hidden flex items-center justify-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="w-full bg-white p-4 flex justify-center gap-4 border-t">
        <Button
          variant={cameraOn ? "default" : "destructive"}
          onClick={toggleCamera}
          className="rounded-full w-14 h-14 flex items-center justify-center text-xl"
        >
          {cameraOn ? "📷" : "🚫📷"}
        </Button>

        <Button
          variant={micOn ? "default" : "destructive"}
          onClick={toggleMic}
          className="rounded-full w-14 h-14 flex items-center justify-center text-xl"
        >
          {micOn ? "🎤" : "🔇"}
        </Button>

        <Button
          variant="destructive"
          onClick={() => endCall(false)}
          className="rounded-full w-14 h-14 flex items-center justify-center text-xl"
        >
          ❌
        </Button>
      </div>
    </div>
  );
}
