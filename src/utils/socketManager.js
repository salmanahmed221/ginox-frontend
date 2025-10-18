import { io } from 'socket.io-client';

let socket = null;

// Function to connect to socket for lottery tickets
export const connectToLotterySocket = () => {
  try {
    // Create new secure socket connection to staging API URL
    socket = io("https://apis.ginox.io");
    console.log("Connecting to lottery socket server...");

    // Handle connection events
    socket.on("connect", () => {
      console.log("Lottery socket connection established successfully!");
      
      // Listen for new lottery tickets
      socket.on("box_lottery_new_tickets", (data) => {
        console.log("New lottery tickets received:", data);
        // You can emit custom events to notify components about new tickets
        window.dispatchEvent(new CustomEvent('lottery-tickets-updated', { detail: data }));
      });

      // Listen for lottery updates
      socket.on("lottery-update", (data) => {
        console.log("Lottery update received:", data);
        window.dispatchEvent(new CustomEvent('lottery-updated', { detail: data }));
      });

      // Listen for lottery winner announcements
      socket.on("lottery-winner", (data) => {
        console.log("Lottery winner announced:", data);
        window.dispatchEvent(new CustomEvent('lottery-winner-announced', { detail: data }));
      });

      // Listen for lottery countdown updates
      socket.on("lottery-countdown", (data) => {
        console.log("Lottery countdown update:", data);
        window.dispatchEvent(new CustomEvent('lottery-countdown-updated', { detail: data }));
      });

      // Listen for pool amount updates
      socket.on("pool-amount-update", (data) => {
        console.log("Pool amount updated:", data);
        window.dispatchEvent(new CustomEvent('pool-amount-updated', { detail: data }));
      });

      console.log("Lottery socket event listeners set up successfully");
    });

    socket.on("connect_error", (error) => {
      console.error("Lottery socket connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Lottery socket disconnected: ${reason}`);
    });

    return socket;
  } catch (error) {
    console.error("Error connecting to lottery socket:", error);
    return null;
  }
};

// Function to disconnect lottery socket connection
export const disconnectLotterySocket = () => {
  try {
    if (socket && socket.connected) {
      console.log("Disconnecting lottery socket...");
      socket.disconnect();
      socket = null;
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error disconnecting lottery socket:", error);
    return false;
  }
};

// Function to get current socket instance
export const getLotterySocket = () => {
  return socket;
};

// Function to check if socket is connected
export const isLotterySocketConnected = () => {
  return socket && socket.connected;
};

// Function to emit custom events to the lottery socket
export const emitLotteryEvent = (eventName, data) => {
  if (socket && socket.connected) {
    socket.emit(eventName, data);
    console.log(`Emitted ${eventName} to lottery socket:`, data);
  } else {
    console.warn("Lottery socket not connected, cannot emit event:", eventName);
  }
};

// Function to join lottery room (if needed)
export const joinLotteryRoom = (roomId) => {
  if (socket && socket.connected) {
    socket.emit("join-lottery-room", roomId);
    console.log(`Joined lottery room: ${roomId}`);
  } else {
    console.warn("Lottery socket not connected, cannot join room");
  }
};

// Function to leave lottery room (if needed)
export const leaveLotteryRoom = (roomId) => {
  if (socket && socket.connected) {
    socket.emit("leave-lottery-room", roomId);
    console.log(`Left lottery room: ${roomId}`);
  } else {
    console.warn("Lottery socket not connected, cannot leave room");
  }
}; 