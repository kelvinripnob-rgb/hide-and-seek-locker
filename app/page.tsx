"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { doc, setDoc, onSnapshot, collection } from "firebase/firestore";

type Role = "login" | "player" | "admin";

export default function Home() {
  const [role, setRole] = useState<Role>("login");
  const [code, setCode] = useState("");
  const [players, setPlayers] = useState<any[]>([]);

  const loginAdmin = () => {
    if (code === "130690") setRole("admin");
    else alert("Mauvais code admin");
  };

  useEffect(() => {
    if (role !== "player") return;

    const watch = navigator.geolocation.watchPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      await setDoc(doc(db, "players", "player1"), {
        lat: latitude,
        lng: longitude,
        role: "cacheur",
        updated: Date.now(),
      });
    });

    return () => navigator.geolocation.clearWatch(watch);
  }, [role]);

  useEffect(() => {
    if (role !== "admin") return;

    const unsub = onSnapshot(collection(db, "players"), (snap) => {
      setPlayers(snap.docs.map((d) => d.data()));
    });

    return () => unsub();
  }, [role]);

  if (role === "login") {
    return (
      <div style={{ padding: 20 }}>
        <h1>🎮 CACHE CACHE GPS</h1>

        <button onClick={() => setRole("player")}>Joueur</button>

        <div style={{ marginTop: 20 }}>
          <h3>Admin</h3>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code admin"
          />
          <button onClick={loginAdmin}>Entrer</button>
        </div>
      </div>
    );
  }

  if (role === "player") {
    return (
      <div style={{ padding: 20 }}>
        <h1>Joueur</h1>
        <p>GPS actif...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>ADMIN PANEL</h1>

      {players.map((p, i) => (
        <div key={i}>
          📍 {p.lat?.toFixed?.(4)} , {p.lng?.toFixed?.(4)}
        </div>
      ))}
    </div>
  );
}