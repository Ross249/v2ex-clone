import { TPending } from '@/interfaces/pending';
import { IReply } from '@/interfaces/reply';
import { ITopic } from '@/interfaces/topic';
import { topicService } from '@/services';
import { topicCrawler } from '@/services/crawler';
import { IThanksReplyResponse } from '@/services/topic';
import { Alert } from '@/utils';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { historyActions } from './history';
import { userActions } from './user';

export const fetchHottestTopic = createAsyncThunk(
  'topic/fetchHottestTopic',
  async () => {
    const reponse = await topicService.fetchHottestTopic();
    return reponse.data;
  },
);

export const fetchLatestTopic = createAsyncThunk(
  'topic/fetchLatestTopic',
  async () => {
    const reponse = await topicService.fetchLatestTopic();
    return reponse.data;
  },
);

export const fetchTopicById = createAsyncThunk(
  'topic/fetchTopicById',
  async (topicId: number) => {
    const response = await topicService.fetchTopicById(topicId);
    return response.data;
  },
);

export const fetchTopicByTab = createAsyncThunk(
  'topic/fetchTopicByTab',
  async (params: { tab: string; refresh: boolean }) => {
    const { tab } = params;
    const response = await topicCrawler.fetchTopicByTab(tab);
    return response;
  },
);

export const fetchRepliesById = createAsyncThunk(
  'topic/fetchRepliesById',
  async (topicId: number) => {
    const response = await topicService.fetchReplyById(topicId);
    return response.data;
  },
);

export const fetchTopicDetails = createAsyncThunk<
  topicCrawler.ITopicDetailsResponse,
  { topicId: number },
  { state: RootState }
>('topic/fetchTopicDetails', async (params, thunkApi) => {
  const nextPage = thunkApi.getState().topic.currPage + 1;

  const response = await topicCrawler.fetchTopicDetails(
    params.topicId,
    nextPage,
  );
  const {
    topic: currentTopic,
    unread,
    myFavNodeCount,
    myFavTopicCount,
    myFollowingCount,
  } = response;

  thunkApi.dispatch(
    historyActions.add({
      id: currentTopic.id,
      title: currentTopic.title,
      author: currentTopic.author,
      avatar: currentTopic.avatar,
      nodeTitle: currentTopic.nodeTitle,
      recordedAt: new Date().getTime(),
    }),
  );
  thunkApi.dispatch(
    userActions.setUserBox({
      unread,
      myFavNodeCount,
      myFavTopicCount,
      myFollowingCount,
    }),
  );
  return response;
});

interface IThanksReplyThunkResponse extends IThanksReplyResponse {
  index: number;
}

export const thanksReplyById = createAsyncThunk<
  IThanksReplyThunkResponse,
  { replyId: number; index: number },
  { state: RootState }
>('topic/thanksReplyById', async (params, thunkApi) => {
  const response = await topicService.thanksReplyById(
    params.replyId,
    thunkApi.getState().topic.once,
  );
  return { ...response.data, index: params.index };
});

export const replyTopic = createAsyncThunk<
  topicCrawler.IReplyResponse,
  { topicId: number },
  { state: RootState }
>('topic/replyTopic', async (params, thunkApi) => {
  const { once, replyContent } = thunkApi.getState().topic;
  const response = await topicCrawler.replyByTopicId(
    params.topicId,
    replyContent,
    once,
  );
  const { problemList } = response;
  if (problemList.length > 0) {
    const problemText = response.problemList.reduce(
      (prev, curr) => `${prev}\n${curr}`,
    );
    Alert.alert({
      message: `回复失败，请检查以下问题:\n${problemText}`,
      onPress: () => {},
    });
  }
  return response;
});

export const favouriteTopic = createAsyncThunk<
  {
    isCollect: boolean;
    csrfToken: string;
  },
  null,
  { state: RootState }
>('topic/favouriteTopic', async (_, thunkApi) => {
  const { currentTopic } = thunkApi.getState().topic;
  const response = await topicCrawler.favouriteTopic(
    currentTopic.id,
    currentTopic.csrfToken!,
  );
  return response;
});

export const unfavouriteTopic = createAsyncThunk<
  {
    isCollect: boolean;
    csrfToken: string;
  },
  null,
  { state: RootState }
>('topic/unfavouriteTopic', async (_, thunkApi) => {
  const { currentTopic } = thunkApi.getState().topic;
  const response = await topicCrawler.unfavouriteTopic(
    currentTopic.id,
    currentTopic.csrfToken!,
  );
  thunkApi.dispatch(fetchTopicById(currentTopic.id));
  return response;
});

interface TopicState {
  currentTopic: ITopic;
  replyList: Array<IReply>;
  pending: TPending;
  isRefreshing: boolean;
  once: string;
  replyContent: string;
  currPage: number;
  maxPage: number | undefined;
  showLoadingModal: boolean;
  relatedReplyList?: Array<IReply>;
}

const initialState: TopicState = {
  currentTopic: {} as ITopic,
  replyList: [] as Array<IReply>,
  pending: 'idle',
  isRefreshing: false,
  once: '',
  replyContent: '',
  currPage: 0,
  maxPage: undefined,
  showLoadingModal: false,
};

export const topicSlice = createSlice({
  name: 'topic',
  initialState: initialState,
  reducers: {
    setReplyContent: (state, action: PayloadAction<string>) => {
      state.replyContent = action.payload;
    },
    resetTopic: (state) => {
      state.currentTopic = {} as ITopic;
      state.replyList = [];
      state.currPage = 0;
      state.maxPage = undefined;
    },
    resetRelatedReplys: (state) => {
      state.relatedReplyList = [];
    },
    getRelatedReplys: (
      state,
      action: PayloadAction<{ index: number; mentionedUsername: string }>,
    ) => {
      const { index, mentionedUsername } = action.payload;
      const prevReplyList = state.replyList.slice(0, index + 1);
      const filteredReplyList = prevReplyList.filter(
        (reply) => reply.author === mentionedUsername,
      );
      filteredReplyList.push(state.replyList[index]);
      state.relatedReplyList = filteredReplyList;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopicDetails.pending, (state, _) => {
        state.pending = 'pending';
      })
      .addCase(fetchTopicDetails.fulfilled, (state, action) => {
        if (action.payload.currPage === 1) {
          state.replyList = action.payload.replyList;
        } else {
          state.replyList = state.replyList.concat(action.payload.replyList);
        }

        state.currentTopic = action.payload.topic;
        state.once = action.payload.once;
        state.pending = 'succeeded';
        state.currPage += 1;
        state.maxPage = action.payload.maxPage;
      })
      .addCase(thanksReplyById.fulfilled, (state, action) => {
        const { index, success, once } = action.payload;
        if (success) {
          state.replyList[index].thanked = true;
          state.replyList[index].thanks += 1;
        }
        state.once = once;
      })
      .addCase(replyTopic.pending, (state, _) => {
        state.showLoadingModal = true;
      })
      .addCase(replyTopic.fulfilled, (state, action) => {
        const { topic, replyList } = action.payload;
        // only replace list when less than 100 replies
        if (topic.replyCount <= 100) {
          state.replyList = replyList;
          state.currentTopic = topic;
        }
        state.once = action.payload.once;
        state.showLoadingModal = false;
        state.replyContent = '';
      })
      .addCase(favouriteTopic.pending, (state, _) => {
        state.showLoadingModal = true;
      })
      .addCase(unfavouriteTopic.pending, (state, _) => {
        state.showLoadingModal = true;
      })
      .addCase(favouriteTopic.fulfilled, (state, action) => {
        const { isCollect, csrfToken } = action.payload;
        state.currentTopic.csrfToken = csrfToken;
        state.currentTopic.likes! += +1;
        state.currentTopic.isCollect = isCollect;
        state.showLoadingModal = false;
      })
      .addCase(unfavouriteTopic.fulfilled, (state, action) => {
        const { isCollect, csrfToken } = action.payload;
        state.currentTopic.csrfToken = csrfToken;
        state.currentTopic.likes! -= 1;
        state.currentTopic.isCollect = isCollect;
        state.showLoadingModal = false;
      })
      .addDefaultCase((state) => {
        state.showLoadingModal = false;
      });
    5;
  },
});

export const topicActions = topicSlice.actions;

export default topicSlice.reducer;
