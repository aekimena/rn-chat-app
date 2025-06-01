import api from '.';

type GoogleAuthResponse = {
  token: string;
  user: {
    _id: string;
    name: string;
    username: string;
    profileImage?: {
      url: string;
      imageId: string;
    };
  };
};

export const loginWithGoogle = async (googleToken: string) => {
  const response = await api.post<GoogleAuthResponse>('/auth/login', {
    token: googleToken,
  });
  return response.data;
};

export const signupWithGoogle = async (googleToken: string) => {
  const response = await api.post<GoogleAuthResponse>('/auth/signUp', {
    token: googleToken,
  });
  return response.data;
};
