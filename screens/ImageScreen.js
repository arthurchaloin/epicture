import React from 'react';
import {
  StyleSheet,
  Platform,
  ScrollView,
  View,
  Text,
  Dimensions,
  StatusBar,
} from 'react-native';
import AutoImage from 'react-native-auto-height-image';
import AsyncImage from '../components/AsyncImage';
import ImageStats from '../components/ImageStats';
import IconButton from '../components/IconButton';
import ImageComments from '../components/ImageComments';
import User from '../api/User';
import AuthImgur from '../api/AuthImgur';
import {Video} from 'expo';

export default class ImageScreen extends React.Component {

  static navigationOptions = ({navigation}) => ({
    ...navigation.state.params,
    title: navigation.state.params && navigation.state.params.title || 'Image',
  });

  state = {
    data: this.props.navigation.state.params && this.props.navigation.state.params.data || {},
    favorite: this.props.navigation.state.params.data.favorite,
  };

  itemWidth = Dimensions.get('window').width;

  getExt = i => i.link.substr(i.link.lastIndexOf('.'));

  async componentDidMount() {
    this.user = await User.get();
    this.imgur = new AuthImgur(this.user.access_token);

    this.props.navigation.setParams({title: this.state.data.title})
    this.navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
    });
  }

  componentWillUnmount() {
    this.navListener.remove();
  }

  async toogleFavorite(id) {
    if (this.user.account_username == this.state.data.account_url || this.user.account_username == this.state.data.images[0].account_url)
      return;

    let data = (await this.imgur.toogleFavorite({albumHash: id})).data.data;
    await this.setState({favorite: data == 'favorited'});
    this.props.navigation.state.params.data.favorite = this.state.favorite;
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <StatusBar barStyle='dark-content' />
        {this.state.data.images.map((image, idx) => this.getExt(image) === '.mp4' ? (
          <Video
            key={idx}
            source={{uri: image.link}}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={{
              width: this.itemWidth,
              height: this.itemWidth,
            }}
          />
        ) : (
            <AsyncImage
              key={idx}
              source={{uri: image.link}}
              width={this.itemWidth}
              style={{
                width: Dimensions.get('window').width,
              }}
            />
          )
        )}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10}}>
          <View style={{paddingLeft: 10}}>
            <ImageStats size={16} color='#000' data={this.state.data} />
            <Text
              style={{paddingLeft: 3}}>Posted by&nbsp;
              <Text
                style={{fontWeight: 'bold'}}
                onPress={() => this.props.navigation.push('Profile', {account: this.state.data.account_url || this.state.data.images[0].account_url})}
              >@{this.state.data.account_url || this.state.data.images[0].account_url}</Text>
            </Text>
          </View>
          <View style={{marginRight: 20}}>
            <IconButton
              size={30}
              color={this.state.favorite ? 'red' : '#000'}
              onPress={() => this.toogleFavorite(this.state.data.id)}
              name={(Platform.OS === 'ios' ? 'ios-heart' : 'md-heart') + (this.state.favorite ? '' : '-empty')}
            />
          </View>
        </View>
        <ImageComments galleryHash={this.state.data.id ? this.state.data.id : this.state.data.images[0].id} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '40%',
  }
});
