import { Colors } from '@/theme/colors';
import Images from '@/theme/images';
import Layout from '@/theme/layout';
import { Link } from '@react-navigation/native';
import React from 'react';
import { Image, Linking, StyleSheet, Text, View } from 'react-native';

const About = () => {
  return (
    <View style={[Layout.fill, styles.container]}>
      <Image style={styles.logo} source={Images.icon} resizeMode="contain" />
      <Text style={styles.desc}>V2EX</Text>
      <View style={styles.content}>
        <View style={[Layout.row]}>
          <Text>address:</Text>
          <Text
            style={styles.link}
            onPress={() => {
              Linking.openURL('https://github.com/Ross249/v2ex-clone');
            }}>
            V2-clone
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          clone by ross249 origin vision in
          https://github.com/xyxc0673/v2ex-plus
        </Text>
      </View>
    </View>
  );
};

export default React.memo(About);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGrey,
    paddingHorizontal: 16,
  },
  logo: {
    marginVertical: 32,
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  desc: {
    alignSelf: 'center',
  },
  content: {
    marginTop: 32,
  },
  link: {
    color: Colors.vi,
    textDecorationLine: 'underline',
    textAlign: 'justify',
  },
  footer: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
  },
  footerText: {
    color: Colors.secondaryText,
    fontSize: 12,
  },
});
