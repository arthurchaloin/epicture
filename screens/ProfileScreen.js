import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  ImageBackground,
  Text,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import {NavigationActions} from 'react-navigation'
import ImageGrid from '../components/ImageGrid';
import Imgur from '../api/Imgur';
import IconButton from '../components/IconButton';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import ImgurConsts from '../constants/Imgur';
import User from '../api/User';

export default class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  static navigationOptions = ({navigation}) => ({
  });

  state = {
    data: [],
    user: this.props.navigation.state.params && this.props.navigation.state.params.account || 'arthurcln',
  };

  async componentDidMount() {
    this.props.navigation.setParams({title: 'Most viral'});
    this.imgur = new Imgur(ImgurConsts.clientId, ImgurConsts.clientSecret);
    this.imgur.login((await User.get()).access_token);
    console.log((await User.get()).access_token);
    const res = await this.imgur.accountSubmissions({
      username: 'online24',
    });
    // console.log(res);
    this.setState({data: res.data.data});
    this.navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
    });
  }

  async initImgur() {
    // let redirectUrl = encodeURIComponent(AuthSession.getRedirectUrl());
    // console.log(redirectUrl);
    // let user = (await AuthSession.startAsync({
    //   authUrl:
    //     `https://api.imgur.com/oauth2/authorize?response_type=token` +
    //     `&client_id=${Credentials.cliendId}` +
    //     `&redirect_uri=${redirectUrl}`,
    // })).params;

    // this.imgur = new Imgur(Credentials.cliendId, Credentials.cliendSecret);
    // let accountImages = await this.imgur.accountImagesFor({
    //   username: 'online24'
    // });
    // console.log(accountImages.data)
    // this.setState({data: accountImages.data.data});
  }

  render() {
    return (
      <ScrollView style={styles.container} bounces={false}>
        <StatusBar barStyle='light-content' />
        <View style={[styles.accountInfoContainer]}>
          <ImageBackground source={{uri: `https://imgur.com/user/${this.state.user}/cover`}} style={{width: Dimensions.get('window').width * 2}}>
            <View style={{width: Dimensions.get('window').width, paddingBottom: 30, paddingTop: getStatusBarHeight() + 20}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 4, justifyContent: 'center', paddingLeft: 20}}>
                  <View style={{flexDirection: 'row', justifyContent: 'center', textAlign: 'center'}}>
                    <Text style={styles.accountName}>@{this.state.user}</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'center', textAlign: 'center'}}>
                    <Text style={styles.accountEmail}>256,332 points - Glorious</Text>
                  </View>
                </View>
                <View style={[styles.profileContainer, {flex: 3, flexDirection: 'row', justifyContent: 'center'}]}>
                  <Image
                    source={{uri: `https://imgur.com/user/${this.state.user}/avatar`}}
                    style={styles.profilePicture}
                  />
                </View>
              </View>
            </View>
            {!(this.props.navigation.state.params && this.props.navigation.state.params.account) ? null : (
              <View style={styles.returnBtn}>
                <IconButton
                  name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
                  size={24}
                  color='#fff'
                  onPress={() => this.props.navigation.dispatch(NavigationActions.back())}
                />
              </View>
            )}
          </ImageBackground>
        </View>
        <View style={{flex: 1}}>
          <ImageGrid
            data={this.state.data}
            itemPressed={(_, data) => this.props.navigation.push('Image', {data})}
            disableRowSizeSelect={true}
            itemsPerRow={2}
          />
        </View>
      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    // maxHeight: 140,
  },
  accountInfoContainer: {
    backgroundColor: '#fff',
    // backgroundColor: 'red',
  },
  profileContainer: {
    // paddingRight: 20,
    // paddingBottom: 20,
  },
  profilePicture: {
    marginVertical: 0,
    marginHorizontal: 'auto',
    borderRadius: 50,
    width: 100,
    height: 100,
  },
  accountName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    // fontWeight: '200',
  },
  accountEmail: {
    color: '#fff',
    fontSize: 14,
  },
  returnBtn: {
    position: 'absolute',
    left: 20,
    top: getStatusBarHeight() + 10,
  },
});
