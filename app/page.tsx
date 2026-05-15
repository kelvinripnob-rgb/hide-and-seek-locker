"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { doc, setDoc, onSnapshot, collection } from "firebase/firestore";

export default function Home() {
  const [role, setRole] = useState<"login" | "player" | "admin">("login");
  const [code, setCode] = useState("");
  const [players, setPlayers] = useState<any[]>([]);

  // 🔴 ADMIN LOGIN
  const loginAdmin = () => {
    if (code === "130690") {
      setRole("admin");
    } else {
      alert("Mauvais code");
    }
  };

  // 📍 ENVOI GPS JOUEUR
  useEffect(() => {
    if (role !== "player") return;

    if (!navigator.geolocation) {
      alert("GPS non supporté");
      return;
    }

    const watch = navigator.geolocation.watchPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      await setDoc(doc(db, "players", "player1"), {
        lat: latitude,
        lng: longitude,
        role: "cacher",
        updated: Date.now(),
      });
    });

    return () => navigator.geolocation.clearWatch(watch);
  }, [role]);

  // 🖥️ LECTURE JOUEURS (ADMIN)
  useEffect(() => {
    if (role !== "admin") return;

    const unsub = onSnapshot(collection(db, "players"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setPlayers(data);
    });

    return () => unsub();
  }, [role]);

  // 🧭 LOGIN SCREEN
  if (role === "login") {
    return (
      <div style={{ padding: 20 }}>
        <h1>🎮 Cache-Cache GPS</h1>

        <button onClick={() => setRole("player")}>
          👤 Joueur
        </button>

        <div style={{ marginTop: 20 }}>
          <h3>🖥️ Admin</h3>
          <input
            placeholder="Code admin"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={loginAdmin}>Entrer</button>
        </div>
      </div>
    );
  }

  // 👤 JOUEUR
  if (role === "player") {
    return (
      <div style={{ padding: 20 }}>
        <h1>👤 Joueur</h1>
        <p>📍 GPS activé (envoi en cours...)</p>
      </div>
    );
  }

  // 🖥️ ADMIN
  if (role === "admin") {
    return (
      <div style={{ padding: 20 }}>
        <h1>🖥️ Admin Panel</h1>

        <h3>👥 Joueurs en ligne :</h3>

        {players.map((p, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            📍 {p.lat?.toFixed?.(4)} , {p.lng?.toFixed?.(4)} <br />
            🎭 {p.role}
          </div>
        ))}
      </div>
    );
  }
}