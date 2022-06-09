import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { Colors } from '@/theme/colors';
import Topics from '../tabbar-index/components/topics';
import { RouteProp, useRoute } from '@react-navigation/core';
import {
  fetchTopicsByNode,
  followNode,
  nodeTopicAction,
} from '@/store/reducers/node-topic';
import Layout from '@/theme/layout';

type ParamList = {
  NodeTopic: {
    nodeName: string;
    nodeTitle: string;
  };
};

const NodeTopic = () => {
  const dispatch = useAppDispatch();
  const topicList = useAppSelector((state) => state.nodeTopic.topicList);
  const isLoading = useAppSelector((state) => state.nodeTopic.pending);
  const isRefreshing = useAppSelector((state) => state.nodeTopic.isRefreshing);
  const topicCount = useAppSelector((state) => state.nodeTopic.topicCount);
  const nodeIntro = useAppSelector((state) => state.nodeTopic.nodeIntro);
  const nodeIcon = useAppSelector((state) => state.nodeTopic.nodeIcon);
  const currPage = useAppSelector((state) => state.nodeTopic.currPage);
  const maxPage = useAppSelector((state) => state.nodeTopic.maxPage) || 1;
  const isNodeFollowed = useAppSelector(
    (state) => state.nodeTopic.isNodeFollowed,
  );
  const nodeCode = useAppSelector((state) => state.nodeTopic.nodeCode);
  const once = useAppSelector((state) => state.nodeTopic.once);
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const [noMore, setNoMore] = useState(false);

  const route = useRoute<RouteProp<ParamList, 'NodeTopic'>>();

  const nodeName = useMemo(() => route.params.nodeName, [route]);

  useEffect(() => {
    dispatch(fetchTopicsByNode({ tab: nodeName, refresh: false }));

    return () => {
      dispatch(nodeTopicAction.resetNodeTopic());
    };
  }, [dispatch, nodeName]);

  useEffect(() => {
    setNoMore(currPage >= (maxPage || 1));
  }, [currPage, maxPage]);

  const listEmptyComponent = React.useMemo(() => {
    return (
      <View style={styles.loading}>
        {isLoading === 'pending' && (
          <ActivityIndicator color={Colors.vi} size={48} />
        )}
      </View>
    );
  }, [isLoading]);

  const handleFollowNode = useCallback(
    (isFollow: boolean) => {
      dispatch(followNode({ nodeCode, nodeName, once, isFollow }));
    },
    [nodeCode, once, dispatch, nodeName],
  );

  const listHeaderComponent = React.useMemo(() => {
    const { nodeTitle } = route.params;
    return (
      <View style={styles.nodeDesc}>
        <View style={Layout.row}>
          <View style={styles.nodeIconContainer}>
            {nodeIcon !== '' && (
              <Image style={styles.nodeIcon} source={{ uri: nodeIcon }} />
            )}
          </View>
          <View style={styles.nodeTitleContainer}>
            <Text style={styles.nodeTitle}>{nodeTitle}</Text>
            <Text style={styles.topicCount}>{`${topicCount}主题`}</Text>
          </View>
          {isLogged && !isNodeFollowed && (
            <TouchableOpacity
              style={styles.follow}
              onPress={() => handleFollowNode(true)}>
              <Text style={styles.followText}>关注</Text>
            </TouchableOpacity>
          )}
          {isLogged && isNodeFollowed && (
            <TouchableOpacity
              style={[styles.follow, styles.unfollow]}
              onPress={() => handleFollowNode(false)}>
              <Text style={styles.unfollowText}>取消关注</Text>
            </TouchableOpacity>
          )}
        </View>
        {nodeIntro !== '' && <Text style={styles.nodeIntro}>{nodeIntro}</Text>}
      </View>
    );
  }, [
    nodeIntro,
    topicCount,
    nodeIcon,
    route,
    isNodeFollowed,
    handleFollowNode,
    isLogged,
  ]);

  const ListFooterComponent = React.useMemo(() => {
    return (
      <>
        <View style={styles.listFooter}>
          <Text style={styles.listFooterText}>
            {noMore ? '没有更多的主题了' : '加载中'}
          </Text>
        </View>
      </>
    );
  }, [noMore]);

  return (
    <View style={styles.container}>
      <Topics
        data={topicList}
        isRefreshing={isRefreshing}
        onControlRefresh={() => {
          dispatch(
            fetchTopicsByNode({ tab: route.params.nodeName, refresh: true }),
          );
        }}
        ListEmptyComponent={listEmptyComponent}
        ListHeaderComponent={listHeaderComponent}
        contentContainerStyle={styles.listContainer}
        itemStyle={styles.itemStyle}
        onEndReached={() => {
          if (currPage >= maxPage) {
            return;
          }
          const { nodeName } = route.params;
          dispatch(fetchTopicsByNode({ tab: nodeName, refresh: false }));
        }}
        onEndReachedThreshold={noMore ? null : 0.01}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
};

export default NodeTopic;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  loading: {
    marginTop: '50%',
  },
  nodeDesc: {
    backgroundColor: Colors.lightGrey,
    padding: 16,
  },
  nodeTitleContainer: {
    marginLeft: 8,
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  nodeIntro: {
    color: Colors.secondaryText,
    fontSize: 14,
    marginTop: 8,
  },
  nodeTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  topicCount: {
    color: Colors.secondaryText,
    fontSize: 12,
  },
  listContainer: {
    flexGrow: 1,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  nodeIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  nodeIconContainer: {
    width: 56,
    height: 56,
    padding: 4,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  itemStyle: {
    paddingHorizontal: 16,
  },
  listFooter: {
    marginVertical: 16,
    marginBottom: 30,
    alignItems: 'center',
  },
  listFooterText: {
    color: Colors.secondaryText,
    fontSize: 12,
  },
  follow: {
    position: 'absolute',
    right: 0,

    backgroundColor: Colors.vi,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  unfollow: {
    backgroundColor: Colors.white,
  },
  followText: {
    color: Colors.white,
  },
  unfollowText: {
    color: Colors.black,
  },
});
