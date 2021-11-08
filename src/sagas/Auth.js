/* eslint-disable no-undef */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  auth,
  facebookAuthProvider,
  githubAuthProvider,
  googleAuthProvider,
  twitterAuthProvider,
} from "../firebase/firebase";
import {
  SIGNIN_FACEBOOK_USER,
  SIGNIN_GITHUB_USER,
  SIGNIN_GOOGLE_USER,
  SIGNIN_TWITTER_USER,
  SIGNIN_USER,
  SIGNIN_TOKEN,
  SIGNOUT_USER,
  SIGNUP_USER,
  VERIFY_TOKEN,
  REFRESH_TOKEN,
  SESSION_TIMEOUT
} from "constants/ActionTypes";
import {
  showAuthMessage,
  userSignInSuccess,
  userSignOutSuccess,
  userSignUpSuccess,
  verifyTokenSuccess,
  refreshTokenSuccess,
} from "actions/Auth";
import {
  userFacebookSignInSuccess,
  userGithubSignInSuccess,
  userGoogleSignInSuccess,
  userTwitterSignInSuccess,
} from "../actions/Auth";

let token = localStorage.getItem("user_id");

// const config = {
//   headers: {
//     accept: "application/json",
//   },
//   data: {},
// };

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const createUserWithEmailPasswordRequest = async (email, password) =>
  await auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => authUser)
    .catch((error) => error);

// const signInUserWithEmailPasswordRequest = async (email, password) =>
//   await auth
//     .signInWithEmailAndPassword(email, password)
//     .then((authUser) => authUser)
//     .catch((error) => error);

const signInUserWithUsernamePasswordRequest = async (request) => {
  // axios
  //   .post(`${baseURL}/auth/login/username`, request, config)
  //   .then((res) => console.log("res", res))
  //   .catch((err) => console.log("err", err));

  const parameters = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  };
  return await fetch(`${baseURL}/auth/login/username`, parameters)
    .then((authUser) => {
      // if (authUser.ok) {
      //   return authUser.json();
      //}
      if (authUser.status === 500 || authUser.status === 401) {
        return authUser;
      } else return authUser.json();
      //  verifyWithTokenRequest();
    })
    .catch((error) => {
      return error;
    });
};


const refreshWithTokenRequest = async () => {
  let request = {
    token: `${localStorage.getItem("refresh_token")}`,
  };
  const parameters = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("user_id")}`,
    },
    body: JSON.stringify(request),
  };

  return fetch(`${baseURL}/auth/login/refresh-token`, parameters)
    .then((authUser) => {
      if (authUser.status === 500 || authUser.status === 401) {
        return authUser;
      } else return authUser.json();
    })
    .catch((error) => {
      return error;
    });
};

// let history = useHistory();

const signInUserWithTokenReferenceRequest = async (request) => {
  const parameters = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  };

  return fetch(`${baseURL}/auth/login/token`, parameters)
    .then((authUser) => {
      if (authUser.status === 500 || authUser.status === 401) {
        return authUser;
      } else return authUser.json();
    })
    .catch((error) => {
      return error;
    });
};

const verifyWithTokenRequest = async () => {
  const parameters = {
    method: "GET",
    headers: {
      // "Content-Type": "application/json",
      Authorization: "Bearer" + " " + token,
    },
    body: JSON.stringify(),
  };
  return fetch(`${baseURL}/auth/token/verify`, parameters)
    .then((token) => {
      // if (token.ok) {
      //   return token.json();
      // }
      // if (token.status === 500 || token.status === 401) {
      //   return token;
      // } else
      fetchApplicationConfigInfo();
      return token.json();
    })
    .catch((error) => {
      return error;
    });
};

export function* refreshWithToken() {
  try {
    const refreshToken = yield call(refreshWithTokenRequest);
    console.log("refreshToken", refreshToken);
    if (refreshToken.responseStatus === "failure") {
      yield put(showAuthMessage(refreshToken.responseMessage));
    } else if (refreshToken.status === 500 || refreshToken.status === 401) {
      yield put(showAuthMessage(refreshToken.statusText));
    } else {
      localStorage.setItem("user_id", refreshToken.accessToken);
      localStorage.setItem("refresh_token", refreshToken.refreshToken);

      yield call(fetchApplicationConfigInfo);
      yield put(refreshTokenSuccess(refreshToken));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* SESSION_TIMEOUT_APPLICATION() {
  try {
    yield put(userSignOutSuccess(signOutUser));
    //yield put(showAuthMessage("Session timed out, please login again!"));
    
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

const signOutRequest = async () =>
  await auth
    .signOut()
    .then((authUser) => authUser)
    .catch((error) => error);

const signInUserWithGoogleRequest = async () =>
  await auth
    .signInWithPopup(googleAuthProvider)
    .then((authUser) => authUser)
    .catch((error) => error);

const signInUserWithFacebookRequest = async () =>
  await auth
    .signInWithPopup(facebookAuthProvider)
    .then((authUser) => authUser)
    .catch((error) => error);

const signInUserWithGithubRequest = async () =>
  await auth
    .signInWithPopup(githubAuthProvider)
    .then((authUser) => authUser)
    .catch((error) => error);

const signInUserWithTwitterRequest = async () =>
  await auth
    .signInWithPopup(twitterAuthProvider)
    .then((authUser) => authUser)
    .catch((error) => error);

const fetchApplicationConfigInfo = () => {
  let uiConfigInfo = [];
  const parameters = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("user_id")}`,
    },
    data: {},
  };

  return fetch(`${baseURL}/configs/ui`, parameters)
    .then((res) => res.json())
    .then((body) => {
      if (body.dataList) {
        uiConfigInfo = body.dataList;
      }

      // modifying the object structure as below
      /**
       * Example:
       * [{ key: "gen.rec.per.page", value: "10"}] ==> {"gen.rec.per.page": 10}
       */
      let modifiedObj = {};
      (uiConfigInfo || []).map((obj) => (modifiedObj[obj.key] = obj.value));
      localStorage.setItem("uiConfigInfo", JSON.stringify(modifiedObj));
      return body;
    })
    .catch((error) => {
      localStorage.setItem("uiConfigInfo", JSON.stringify({}));
      return error;
    });
};

function* createUserWithEmailPassword({ payload }) {
  const { email, password } = payload;
  try {
    const signUpUser = yield call(
      createUserWithEmailPasswordRequest,
      email,
      password
    );
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      localStorage.setItem("user_id", signUpUser.user.uid);
      yield put(userSignUpSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithGoogle() {
  try {
    const signUpUser = yield call(signInUserWithGoogleRequest);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      localStorage.setItem("user_id", signUpUser.user.uid);
      yield put(userGoogleSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithFacebook() {
  try {
    const signUpUser = yield call(signInUserWithFacebookRequest);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      localStorage.setItem("user_id", signUpUser.user.uid);
      yield put(userFacebookSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithGithub() {
  try {
    const signUpUser = yield call(signInUserWithGithubRequest);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      localStorage.setItem("user_id", signUpUser.user.uid);
      yield put(userGithubSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithTwitter() {
  try {
    const signUpUser = yield call(signInUserWithTwitterRequest);
    if (signUpUser.message) {
      if (signUpUser.message.length > 100) {
        yield put(showAuthMessage("Your request has been canceled."));
      } else {
        yield put(showAuthMessage(signUpUser.message));
      }
    } else {
      localStorage.setItem("user_id", signUpUser.user.uid);
      yield put(userTwitterSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* signInUserWithUsernamePassword({ payload }) {
  let request = {
    username: payload.name,
    password: payload.password,
  };

  try {
    const signInUser = yield call(
      signInUserWithUsernamePasswordRequest,
      request
    );

    if (signInUser.responseStatus === "failure") {
      yield put(showAuthMessage(signInUser.responseMessage));
    } else if (signInUser.status === 500 || signInUser.status === 401) {
      yield put(showAuthMessage(signInUser.statusText));
    } else {
      localStorage.setItem("user_id", signInUser.authorizationToken);
      localStorage.setItem("dashboardType", signInUser.dashboardType);
      localStorage.setItem("refresh_token", signInUser.refreshToken);
      localStorage.setItem("refreshExpireTime", signInUser.refreshExpiresIn);

      yield call(fetchApplicationConfigInfo);
      // localStorage.setItem("token", "19b28fc77a1a477f02b0ea6a24f90366");
      yield put(userSignInSuccess(signInUser));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* signInUserWithTokenReference({ payload }) {
  let request = {
    token: payload.tokenQuery,
    reference: payload.referenceQuery,
  };

  try {
    const signInUser = yield call(signInUserWithTokenReferenceRequest, request);

    if (signInUser.responseStatus === "failure") {
      yield put(showAuthMessage(signInUser.responseMessage));
    } else if (signInUser.status === 500 || signInUser.status === 401) {
      yield put(showAuthMessage(signInUser.statusText));
    } else {
      localStorage.setItem("user_id", signInUser.authorizationToken);
      // localStorage.setItem("token", "19b28fc77a1a477f02b0ea6a24f90366");
      yield put(userSignInSuccess(signInUser));
      // verifyWithToken();
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* verifyWithToken() {
  try {
    const token = yield call(verifyWithTokenRequest);
    if (token.responseStatus === "failure") {
      yield put(userSignOutSuccess(signOutUser));
      yield put(showAuthMessage("Session timed out, please login again!"));
    }
    //  else if (token.status === 500 || token.status === 401) {
    //   yield put(showAuthMessage(token.statusText));
    // }
    else {
      
      //localStorage.setItem("user_id", token.authorizationToken);
      // localStorage.setItem("token", "19b28fc77a1a477f02b0ea6a24f90366");
      yield put(verifyTokenSuccess(token));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signOut() {
  try {
    const signOutUser = yield call(signOutRequest);
    if (signOutUser === undefined) {
      localStorage.removeItem("user_id");
      localStorage.removeItem("dashboardType");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("refreshExpireTime");
      localStorage.removeItem("uiConfigInfo");
      localStorage.removeItem("enquiryid");
      localStorage.removeItem("quoteId");
      yield put(userSignOutSuccess(signOutUser));
    } else {
      yield put(showAuthMessage(signOutUser.message));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* createUserAccount() {
  yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
}

export function* signInWithGoogle() {
  yield takeEvery(SIGNIN_GOOGLE_USER, signInUserWithGoogle);
}

export function* signInWithFacebook() {
  yield takeEvery(SIGNIN_FACEBOOK_USER, signInUserWithFacebook);
}

export function* refreshToken() {
  yield takeEvery(REFRESH_TOKEN, refreshWithToken);
}

export function* sessiontimeout() {
  yield takeEvery(SESSION_TIMEOUT, SESSION_TIMEOUT_APPLICATION);
}

export function* signInWithTwitter() {
  yield takeEvery(SIGNIN_TWITTER_USER, signInUserWithTwitter);
}

export function* signInWithGithub() {
  yield takeEvery(SIGNIN_GITHUB_USER, signInUserWithGithub);
}

export function* signInUser() {
  yield takeEvery(SIGNIN_USER, signInUserWithUsernamePassword);
}

export function* signInToken() {
  yield takeEvery(SIGNIN_TOKEN, signInUserWithTokenReference);
}

export function* verifyToken() {
  yield takeEvery(VERIFY_TOKEN, verifyWithToken);
}

export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}

export default function* rootSaga() {
  yield all([
    fork(signInUser),
    fork(signInToken),
    fork(verifyToken),
    fork(refreshToken),
    fork(sessiontimeout),
    fork(createUserAccount),
    fork(signInWithGoogle),
    fork(signInWithFacebook),
    fork(signInWithTwitter),
    fork(signInWithGithub),
    fork(signOutUser),
  ]);
}
