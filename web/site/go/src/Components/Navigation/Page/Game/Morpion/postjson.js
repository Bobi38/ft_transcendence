export const postJson = (data) => {
    return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  };
}

const exemple = [" ", " ", " ", " ", " ", " ", " ", " ", " "]
const exemple1 = ["X", "0", "X", " ", "X", "0", "X", " ", "0"]
const exemple2 = [" ", "0", " ", " ", " ", "X", " ", " ", "0"]


export const initial = {
    message: "attente joueur",
    partyId: undefined,
    player: undefined,
    tab: exemple1,
    start: false,
    move: undefined,
}