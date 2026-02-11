useEffect(() => {
  const handleMorpion = (data) => {
    if (data.action === "waiting") {
      console.log("En attente d'un joueur...");
    }

    if (data.action === "start") {
      console.log("Partie commencée, joueur", data.mess.player);
    }
  };

  SocketM.onMorpion(handleMorpion);

  SocketM.sendd({
    type: "morpion",
    action: "join"
  });

  return () => {
    // optionnel : clean listener
  };
}, []);