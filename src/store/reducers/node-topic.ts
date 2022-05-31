import { TPending } from '@/interfaces/pending';
import { ITopic } from '@/interfaces/topic';
import { topicCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { fetchMyNodes } from './user';
