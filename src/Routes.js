import React from 'react';
import { Switch, Router, Redirect, Route } from 'react-router-dom';

import history from 'src/history';
import CustomRoute from 'src/components/CustomRoute';
import Demo from './pages/home/Demo';

import Home from 'src/pages/home/Home';
import Login from 'src/pages/home/Login';
import VideoPage from 'src/pages/home/VideoPage';
import CountryCode from 'src/pages/home/CountryCode';
import OpenId from './pages/home/OpenId';

import Category from 'src/pages/home/Category';
import EncyclopediaDetail from 'src/pages/encyclopedias/EncyclopediaDetail';

import QuestionDetail from 'src/pages/questions/QuestionDetail';
import QuestionReply from 'src/pages/questions/QuestionReply';
import QuestionComments from 'src/pages/questions/QuestionComments';
import QuestionAnswer from 'src/pages/questions/QuestionAnswer';
import QuestionReplySucc from './pages/questions/QuestionReplySucc';

import VideoDetail from 'src/pages/videos/VideoDetail';
import VideoReply from 'src/pages/videos/VideoReply';
import VideoComments from 'src/pages/videos/VideoComments';

import ArticleDetail from 'src/pages/articles/ArticleDetail';
import ArticleReply from 'src/pages/articles/ArticleReply';
import ArticleComments from 'src/pages/articles/ArticleComments';

import ActivityDetail from 'src/pages/activities/ActivityDetail';
import ActivityPay from 'src/pages/activities/ActivityPay';
import ActivityList from 'src/pages/activities/ActivityList';
import ActivityComment from 'src/pages/activities/ActivityComment';

import ServiceDetail from 'src/pages/service/ServiceDetail';
import ServiceComment from 'src/pages/service/ServiceComment';
import ServiceList from 'src/pages/service/ServiceList';

import PaySuccess from 'src/pages/mall/PaySuccess';

import ForumList from 'src/pages/forums/ForumList';
import ForumDetail from 'src/pages/forums/ForumDetail';
import ForumAdd from 'src/pages/forums/ForumAdd';
import ForumReply from 'src/pages/forums/ForumReply';

import VideoPublish from 'src/pages/publish/VideoPublish';
import GoodsPublish from 'src/pages/publish/GoodsPublish';
import QuestionPublish from 'src/pages/publish/QuestionPublish';
import PublishArticle from './pages/publish/PublishArticle';
import PublishSuccess from './pages/publish/PublishSuccess';

import GoodsList from 'src/pages/mall/GoodsList';
import GoodsDetail from 'src/pages/mall/GoodsDetail';
import GoodsComment from 'src/pages/mall/GoodsComment';
import ShoppingCart from 'src/pages/mall/ShoppingCart';
import Settlement from 'src/pages/mall/Settlement';

import BusinessUpload from 'src/pages/others/businessOther/BusinessUpload';
import OtherHome from 'src/pages/others/OtherHome';

import UserCenter from 'src/pages/userCenter/UserCenter';
import UserList from 'src/pages/userCenter/UserList';
import BusinessCenter from 'src/pages/businessCenter/BusinessCenter';
import UserOrder from 'src/pages/userCenter/UserOrder';
import UserSettings from 'src/pages/userCenter/UserSettings';

import AddressList from 'src/pages/address/AddressList';
import AddressEdit from 'src/pages/address/AddressEdit';

import UploadManage from 'src/pages/mine/UploadManage';
import Search from './pages/home/Search';

import ShopCon from './pages/shop/ShopCon';

const Routes = props => {
  return (
    <Router history={history}>
      <Switch>
        {/* 主页 */}
        <CustomRoute exact path="/" component={Home} />
        {/* 登录 */}
        <CustomRoute path="/login" component={Login} />

        {/* 搜索 */}
        <CustomRoute path="/search" component={Search} />

        {/* 分类 */}
        <Route
          path="/categories"
          render={props => (
            <CustomRoute
              key={props.location.search}
              path="/categories"
              component={Category}
              {...props}
            />
          )}
        />

        {/* 视频 */}
        <CustomRoute path="/videos/:id/reply" component={VideoReply} needLogin={true} />
        <CustomRoute path="/videos/:id/comments" component={VideoComments} needLogin={true} />
        <CustomRoute keys="id" path="/videos/:id" component={VideoDetail} />

        {/* 文章 */}
        <CustomRoute path="/articles/:id/reply" component={ArticleReply} needLogin={true} />
        <CustomRoute path="/articles/:id/comments" component={ArticleComments} needLogin={true} />
        <CustomRoute keys="id" path="/articles/:id" component={ArticleDetail} />

        {/* 百科 */}
        <CustomRoute keys="id" path="/encyclopedias/:id" component={EncyclopediaDetail} />

        {/* 问题 */}
        <CustomRoute path="/questions/reply-succ" component={QuestionReplySucc} needLogin={true} />
        <CustomRoute path="/questions/:id/reply" component={QuestionReply} needLogin={true} />
        <CustomRoute path="/questions/:id/comments" component={QuestionComments} needLogin={true} />
        <CustomRoute keys="id" path="/questions/:id" component={QuestionDetail} />
        <CustomRoute path="/answers/:id" component={QuestionAnswer} needLogin={true} />

        {/* 发布 */}
        <CustomRoute path="/publish/video" component={VideoPublish} needLogin={true} />
        <CustomRoute path="/publish/goods" component={GoodsPublish} needLogin={true} />
        <CustomRoute path="/publish/question" component={QuestionPublish} needLogin={true} />
        <CustomRoute path="/publish/article" component={PublishArticle} needLogin={true} />
        <CustomRoute path="/publish/success" component={PublishSuccess} needLogin={true} />

        {/* 活动相关 */}
        <CustomRoute path="/pay/activities" component={ActivityPay} />
        <CustomRoute path="/activities/:id/comments" component={ActivityComment} needLogin={true} />
        <CustomRoute keys="id" path="/activities/:id" component={ActivityDetail} />
        <CustomRoute path="/activities" component={ActivityList} />

        {/* 服务相关 */}
        <CustomRoute path="/service/:id/comments" component={ServiceComment} needLogin={true} />
        <CustomRoute keys="id" path="/service/:id" component={ServiceDetail} />
        <CustomRoute path="/services" component={ServiceList} />

        {/* 商城 */}
        <CustomRoute path="/pay-success" component={PaySuccess} />
        <CustomRoute path="/shopping-cart" component={ShoppingCart} needLogin={true} />
        <CustomRoute path="/pay/settlement" component={Settlement} needLogin={true} />
        <CustomRoute keys="id" path="/shopCon/:id" component={ShopCon}/>

        {/* 酷圈 */}
        <CustomRoute path="/forums/add" component={ForumAdd} needLogin={true} />
        <CustomRoute path="/forums/:id/reply" component={ForumReply} needLogin={true} />
        <CustomRoute path="/forums/:id" component={ForumDetail} />
        <CustomRoute path="/forums" component={ForumList} />

        {/* 获取openid */}
        <CustomRoute path="/openid" component={OpenId} />
        {/* 播放视频 */}
        <CustomRoute path="/play-video" component={VideoPage} />
        {/* 选择国家代码 */}
        <CustomRoute path="/country-code" component={CountryCode} />

        {/* 淘货 */}
        <CustomRoute path="/goods/:id/comments" component={GoodsComment} />
        <CustomRoute keys="id" path="/goods/:id" component={GoodsDetail} />
        <CustomRoute path="/goods" component={GoodsList} />

        {/* 用户收货人地址 */}
        <CustomRoute path="/address/:id" component={AddressEdit} />
        <CustomRoute path="/address" component={AddressList} />

        {/* 他人主页 */}
        <CustomRoute path="/users/:uid" component={OtherHome} />
        <CustomRoute path="/business-upload/:uid/:type" component={BusinessUpload} />

        {/*用户中心*/}
        <CustomRoute path="/user-center" component={UserCenter} needLogin={true} />
        <CustomRoute path="/mine/upload" component={UploadManage} needLogin={true} />
        <CustomRoute path="/mine/settings" component={UserSettings} needLogin={true} />
        <CustomRoute path="/mine/list" component={UserList} needLogin={true} />

        {/*我的订单*/}
        <CustomRoute path="/user-order" component={UserOrder} needLogin={true} />
        {/*商家中心*/}
        <CustomRoute path="/business-center" component={BusinessCenter} needLogin={true} />

        {/* Demo */}
        <CustomRoute path="/demo" component={Demo} />

        {/* 404返回首页 */}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default Routes;
