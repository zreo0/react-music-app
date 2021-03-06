import * as API from "api/config";
import * as PARSE from "utils/parse";

export const getHomeData = () => {
  return async (dispatch) => {
    try {
      const newSongResponse = await API.getNewSong();
      const remdResponse = await API.getRemd();

      dispatch({
        type: "SETHOMEDATA",
        result: {
          newSong: PARSE.newSong(newSongResponse),
          remd: PARSE.remd(remdResponse),
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getRankData = () => {
  return async (dispatch) => {
    try {
      const response = await API.getRank();

      dispatch({
        type: "SETRANKDATA",
        result: PARSE.rank(response),
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getHotWord = () => {
  return async (dispatch) => {
    try {
      const response = await API.getWord();

      dispatch({
        type: "SETHOTWORD",
        result: response.data.result.hots,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getPlaylist = (id) => {
  return async (dispatch) => {
    try {
      const response = await API.getPlaylist(id);

      dispatch({
        type: "SETPLAYLIST",
        result: PARSE.playList(response),
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getSearchSong = () => {
  return async (dispatch, getState) => {
    try {
      const word = getState().curWord;
      const response = await API.getSearchSong(word);

      dispatch({
        type: "GETSEARCHSONG",
        result: PARSE.search(response),
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const clearSearchSong = () => {
  return {
    type: "CLEARSEARCH",
  };
};

export const setCurWord = (word) => {
  return {
    type: "SETCURWORD",
    curWord: word.trim(),
  };
};

export const setCurMusic = (music) => {
  return async (dispatch) => {
    const { id, artists, title } = music;
    const check = await API.checkMusic(id);
    if (check.data.success) {
      const resData = await Promise.all([
        API.getMusicUrl(id),
        API.getComment(id),
        API.getMusicDetail(id),
      ]);

      const musicUrl = resData[0].data.data[0].url;
      const imgUrl = resData[2].data.songs[0].al.picUrl;

      if (!musicUrl) {
        return "DISABLEMUSIC";
      }
      dispatch({
        type: "SETMUSICINFO",
        result: {
          id,
          musicUrl,
          imgUrl,
          artists,
          title,
          comment: PARSE.comment(resData[1].data.hotComments),
        },
      });
    } else {
      return "DISABLEMUSIC";
    }
    return "success";
  };
};

export const setPlayerStatus = (status) => {
  return {
    type: "SETPLAYERSTATUS",
    status,
  };
};
