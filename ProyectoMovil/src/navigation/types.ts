export type RootStackParamList = { //selfexplanatory no ocupo explicar esta parte
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
};

export type MainTabParamList = {
  Rooms: undefined;         // Salas de estudio (nested stack)
  Focus: undefined;         // Temporizador
  Flashcards: undefined;    // Tarjetas de repaso
  Profile: undefined;       // Perfil del estudiante
};

export type RoomsStackParamList = {
  RoomsList: undefined;
  Chat: { roomId: string; roomName: string; subject: string };
};