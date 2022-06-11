import { Avatar } from '@/components';
import {
  fetchUserProfile,
  fetchUserReplies,
  fetchUserTopics,
  profileActions,
  followUser,
} from '@/store/reducers/profile';
import { Colors } from '@/theme/colors';
import Layout from '@/theme/layout';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Topic from './components/topic';
import Reply from './components/reply';
import Information from './components/Information';
import { screenWidth } from '@/utils/adapter';

type ParamList = {
  Detail: {
    userId: number;
    username: string;
  };
};

const Profile = () => {
  const route = useRoute<RouteProp<ParamList, 'Detail'>>();

  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.profile.userInfo);
  const userTopicList = useAppSelector((state) => state.profile.userTopicList);
  const userReplyList = useAppSelector((state) => state.profile.userReplyList);
  const isTopicsHidden = useAppSelector(
    (state) => state.profile.isTopicsHidden,
  );
  const user = useAppSelector((state) => state.user.user);
  const isUserFollowed = useAppSelector(
    (state) => state.profile.isUserFollowed,
  );
  const once = useAppSelector((state) => state.profile.once);
  const isLogged = useAppSelector((state) => state.user.isLogged);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: userInfo.username });
  }, [navigation, userInfo]);

  useEffect(() => {
    const { username } = route.params;
    dispatch(fetchUserProfile(username));
    dispatch(fetchUserTopics({ username, page: 1 }));
    dispatch(fetchUserReplies({ username, page: 1 }));

    return () => {
      dispatch(profileActions.reset());
    };
  }, [dispatch, route.params]);

  const handleFollowUser = useCallback(
    (isFollow: boolean) => {
      console.log('handleFollowUser', isFollow);
      dispatch(
        followUser({
          userId: userInfo.id,
          username: userInfo.username,
          once,
          isFollow,
        }),
      );
    },
    [userInfo, once, dispatch],
  );

  const renderHeader = React.useMemo(() => {
    return (
      <>
        <View style={[Layout.row, styles.userInfoHeader]}>
          <View style={[Layout.row, Layout.fullWidth]}>
            <View style={styles.userInfoHeaderLeft}>
              <Avatar size={60} source={{ uri: userInfo.avatar }} />
              {userInfo.isOnline && <View style={styles.online} />}
            </View>
            <View style={styles.userInfoHeaderCenter}>
              <Text style={styles.username}>{userInfo.username}</Text>
              <Text style={styles.bio}>{userInfo.bio}</Text>
              <View />
            </View>
            <View>
              {isLogged && userInfo.username !== user.username && (
                <>
                  <TouchableOpacity
                    style={[
                      styles.btn,
                      isUserFollowed ? styles.btnUnfollow : styles.btnFollow,
                    ]}
                    onPress={() => handleFollowUser(!isUserFollowed)}>
                    <Text
                      style={[
                        styles.btnText,
                        isUserFollowed && styles.btnUnfollowText,
                      ]}>
                      {isUserFollowed ? '取消关注' : '关注'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </>
    );
  }, [user, userInfo, isUserFollowed, handleFollowUser, isLogged]);

  return (
    <View style={[Layout.fill, styles.container]}>
      <Tabs.Container
        HeaderComponent={() => renderHeader}
        headerContainerStyle={styles.tabHeaderContainer}
        initialTabName="Topic"
        TabBarComponent={(props) => (
          <MaterialTabBar {...props} indicatorStyle={styles.tabIndicator} />
        )}>
        <Tabs.Tab name="Info" label="资料">
          <Tabs.ScrollView contentContainerStyle={[styles.tabContent]}>
            <Information data={userInfo} />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Topic" label="主题">
          <Tabs.FlatList
            data={userTopicList}
            contentContainerStyle={[styles.tabContent]}
            keyExtractor={(item) => `user_topic_${item.id}`}
            renderItem={({ item }) => <Topic item={item} />}
            ListEmptyComponent={() => {
              if (isTopicsHidden) {
                return (
                  <View style={styles.emptyWrapper}>
                    <Text
                      style={
                        styles.emptyText
                      }>{`根据 ${userInfo.username} 的设置，主题列表被隐藏`}</Text>
                  </View>
                );
              }
              return (
                <View style={styles.emptyWrapper}>
                  <Text style={styles.emptyText}>空空如也</Text>
                </View>
              );
            }}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Reply" label="回复">
          <Tabs.FlatList
            data={userReplyList}
            contentContainerStyle={[styles.tabContent]}
            keyExtractor={(item, index) => `user_topic_${index}`}
            renderItem={({ item }) => <Reply item={item} />}
          />
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  userInfoHeader: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: Colors.white,
  },
  userInfoHeaderLeft: {
    alignItems: 'center',
  },
  userInfoHeaderCenter: {
    marginLeft: 12,
    justifyContent: 'flex-start',
    flex: 1,
  },
  username: {
    fontSize: 18,
  },
  bio: {
    fontSize: 14,
    marginTop: 4,
    color: Colors.secondaryText,
  },
  online: {
    fontSize: 12,
    marginTop: 4,
    width: 16,
    height: 16,
    borderRadius: 16,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.green,
  },

  btn: {
    backgroundColor: Colors.vi,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  btnText: {
    color: Colors.white,
    fontSize: 14,
  },
  btnFollow: {
    backgroundColor: Colors.vi,
  },
  btnUnfollow: {
    backgroundColor: Colors.lightGrey,
  },
  btnUnfollowText: {
    color: Colors.black,
  },
  tabHeaderContainer: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 0,
  },
  tabIndicator: {
    backgroundColor: Colors.vi,
  },
  tabContent: {
    backgroundColor: Colors.lightGrey,
    flexGrow: 1,
    marginTop: 8,
  },
  emptyWrapper: {
    width: screenWidth,
    paddingVertical: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.secondaryText,
  },
});
