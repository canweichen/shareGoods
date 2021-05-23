<?php
namespace app\wechat\controller;

use think\Cache;
use \think\Controller;
use \think\Db;
class Index extends Controller{
    public function redis(){
        $redis = Cache::store('redis')->handler();
        //$redis->hmset('goods:1',array('people'=>'kankan'));
        //$redis->set('hello','world');
//        foreach($redis->keys('*')  as $k){
//            $redis->del($k);
//        }
        print_r($redis->keys("*"));
    }
    /*
     * Author:Bruce
     * Time:2019-03-06
     * 接口说明:获取主页优惠券商品
     * 接口url: https://selfcenter.top/tp_front/public/index.php/wechat/Index/getGoodsList
     * request_type:GET
     * request_params:$page number 分页页码
     *                $cid number 商品类型
     * return:json包 {status:0/1,msg:'数据信息',data:[数据集]}
     * */
    public function getGoodsList(){
        $page = max(input('page'),1);
        $cid = input('cid');
        $limit = 20;
        $whe = array();
        $result = array('status'=>0,'msg'=>'无效参数','data'=>[]);
        //判断传入的参数是否合法
        if(!is_numeric($page) || !is_numeric($cid)){
            return json($result);
        }
        //数据库获取数据 缓存1小时cache(3600)
        if($cid){
            $whe = array('cid'=>$cid);
        }
        $arr_data = db('tb_goods')
            ->field('gid,cid,pic,title,org_price,sales_num,price,quan_price,quan_surplus,commission')
            ->where($whe)
            ->page($page,$limit)
            ->select();
        //输出当前查询sql
        //echo db('tb_goods')->cache(3600)->limit($page,$limit)->fetchSql(true)->select();die;
        if(count($arr_data) > 0){
            $result['status'] = 1;
            $result['msg'] = 'ok';
            $result['data'] = $arr_data;
        }else{
            $result['msg'] = 'empty';
        }
        echo json_encode($result);
    }
    /*
     * Author:Bruce
     * Time:2019-03-07
     * 接口说明:获取优惠券详细信息
     * 接口url: https://selfcenter.top/tp_front/public/index.php/wechat/Index/getGoodsDetail
     * request_type:GET
     * request_params:gid number 商品ID唯一标识
     *                cid number 商品类别
     * return:json包 {status:0/1,msg:'数据信息',data:[数据集]}
     * */
    public function getGoodsDetail(){
        $result = array('status'=>0,'msg'=>'无效券','data'=>[]);
        $gid = input('gid');
        $cid = input('cid');
        //判断是否为有效商品ID和类型ID
        if(!is_numeric($gid) || !is_numeric($cid)){
            return json($result);
        }
        //获取详情页商品
        $data = db('tb_goods')->field('quan_time,quan_surplus,quan_receive',true)->where(array('gid'=>$gid))->find();
        $redis = Cache::store('redis')->handler();
        $g_key = 'goods:type:'.$cid;
        if($redis->exists($g_key)){
            $sList = json_decode($redis->get($g_key),true);
        }else{
            //获取相似商品列表
            $sList = db("tb_goods")
                ->field('quan_time,quan_surplus,quan_receive,quan_id,saller_id',true)
                ->where(array('cid'=>$cid))
                ->order('quan_price desc')
                ->limit(8)
                ->select();
            $redis->set($g_key,json_encode($sList));
        }
        $result['list'] = $sList;
        if(!empty($data)){
            $result['data'] = $data;
            $result['status'] = 1;
            $result['msg'] = 'ok';
        }else{
            $result['msg'] = 'empty';
        }
        return json($result);
    }

    /*
     * Author:Bruce
     * Time:2019-03-07
     * 接口说明:获取不同条件优惠券列表
     * 接口url: https://selfcenter.top/tp_front/public/index.php/wechat/Index/getOtherTypeGoodsList
     * request_type:GET
     * request_params:type number 请求商品的类目ID
     * return:json包 {status:0/1,msg:'数据信息',data:[数据集]}
     * */
    public function getOtherTypeGoodsList(){
        //获取参数
        $tid = input('type');
        $result = array('status'=>0,'msg'=>'查询失败','data'=>[]);
        //参数检测
        if(!is_numeric($tid)){
            return json($result);
        }
        //判断请求类型
        $whe = array();
        switch($tid){
            case 0:
                //获取今日新品
                $ord = 'gid desc';
                break;
            case 1:
                //日用快消
                $whe = array('cid'=>4);
                $ord = 'sales_num desc';
                break;
            case 2:
                //拼团商品
                $whe = array('cid'=>['>=',12]);
                $ord = 'sales_num desc';
                break;
            case 3:
                //热销榜
                $ord = 'sales_num desc';
                break;
            case 4:
                //人气榜
                $ord = 'quan_receive desc';
                break;
            case 5:
                //品牌尖货
                $whe = array('cid'=>8);
                $ord = 'sales_num desc';
                break;
            case 6:
                //母婴
                $whe = array('cid'=>2);
                $ord = 'sales_num desc';
                break;
            case 7:
                //高佣榜
                $ord = 'commission desc';
                break;
            case 8:
                //大额券
                $ord = 'quan_price desc';
                break;
            default:
                return json($result);
        }
        $o_key = 'other:type'.$tid;
        $redis = Cache::store('redis')->handler();
        if($redis->exists($o_key)){
            $gList = json_decode($redis->get($o_key),true);
        }else{
            $gList = db('tb_goods')
                ->field('quan_time,quan_surplus,quan_receive,quan_id,saller_id',true)
                ->where($whe)
                ->order($ord)
                ->limit(20)
                ->select();
            $redis->set($o_key,json_encode($gList));
        }
        $result['data'] = $gList;
        if(count($gList)>0){
            $result['status'] = 1;
            $result['msg'] = 'ok';
        }else{
            $result['msg'] = 'empty';
        }
        return json($result);
    }

    /**
     * 接口说明:获取分享商品详情信息
     * 接口url:https://selfcenter.top/tp_front/public/index.php/wechat/Index/getShareGoods
     * request_type:GET
     * request_parmas:gid number 商品id
     * return:json
     */
    public function getShareGoods(){
        $gid = input('gid');
        $data = db('tb_goods')->where(array('gid'=>$gid))->find();
        return json($data);
    }

    
    //获取轮播图
    public function getBanner(){
        $data = db('t_banner')->select();
        echo json_encode($data);
    }
    //获取首页信息
    public function getAllInformation(){
        $page = input('?get.page')?input('page'):1;
        $total = 5;
        $start =($page-1)*$total;
        $data = db('t_trade')
            ->alias('g')
            ->join('t_user u','u.userid = g.userid')
            ->where('g.tradestate',1)
            ->where('g.goods_sale_type',1)
            ->field('g.tradeid as id ,g.tradename as goods , u.nickname as name , u.headimg as img , g.cities as city , g.areas as area , g.nowprice as price ,
            g.provinces as list , g.lookcount , g.collectcount')
            ->order('g.createtime desc')
            ->limit($start,$total)
            ->select();
        for($i=0;$i<count($data);$i++){
            $res = db('t_tradeimages')->where('tradeid',$data[$i]['id'])->select();
            $data[$i]['list'] = $res;
        }
        echo json_encode($data);
    }
    //获取附近的人发布的商品
    public function getNearInformation(){
        $city = input("?get.city")?input('city'):'';
        $page = input('?get.page')?input('page'):'';
        $total = 3;
        $start =($page-1)*$total;
        $data = db('t_trade')
            ->alias('g')
            ->join('t_user u','u.userid = g.userid')
            ->where('g.tradestate',1)
            ->where('g.cities',$city)
            ->where('g.goods_sale_type',1)
            ->field('g.tradeid as id ,g.tradename as goods , u.nickname as name , u.headimg as img , g.cities as city , g.areas as area , g.nowprice as price ,
            g.provinces as list , g.lookcount , g.collectcount')
            ->order('g.createtime desc')
            ->limit($start,$total)
            ->select();

        for($i=0;$i<count($data);$i++){
            $res = db('t_tradeimages')->where('tradeid',$data[$i]['id'])->select();
            $data[$i]['list'] = $res;
        }
        echo json_encode($data);
    }
    //获取商品详情
    public function getDetails(){
        $id = input("?post.id")?input('id'):'';
        $user = input("?post.user")?input('user'):'';
        //将浏览记录+1
        db('t_trade')->where('tradeid',$id)->setInc('lookcount',1);
        $data = db('t_trade')
            ->alias('g')
            ->join('t_user u','u.userid = g.userid')
            ->where('g.tradeid',$id)
            ->field('g.*,u.*,g.cities as city ')
            ->select();
        //后期正式登陆后需要修改userid的值
            $collect = db('t_collect')->where(['userid'=>$user,'tradeid'=>$id])->select();
            $res = db('t_tradeimages')->where('tradeid',$id)->select();
            $data[0]['usergps'] = $res;
            $data[0]['tradename'] = $collect;
        echo json_encode($data);
    }
    //商品收藏
    public function collect(){
        //判断session是否存在
        $id = input('?get.id')?input('id'):'';
        $user = input("?get.user")?input('user'):'';
        $data = [
            'userid' => $user ,
            'tradeid' => $id ,
            'collecttime' => date('Y-m-d H:i:s',time())
        ];
        $res = db('t_collect')->insert($data);
        if($res){
            //商品的浏览量
            db('t_trade')->where('tradeid',$id)->setInc('collectcount',1);
            echo json_encode(config('errorMsg')['operation']['update']['code_ok']);
        }else{
            echo json_encode(config('errorMsg')['operation']['update']['code_fail']);
        }
    }
    public function curlHttp($url,$type,$formData){
        /*初始化url*/
        $path=curl_init();
        /*http请求发往哪里*/
        curl_setopt($path,CURLOPT_URL,$url);
        /*http数据请求类型*/
        curl_setopt($path,CURLOPT_CUSTOMREQUEST,$type);
        /*from data内容*/
        curl_setopt($path,CURLOPT_POSTFIELDS,$formData);
        /*如果不设置这个参数，curl执行结束，只会告诉你http请求是200的状态与否，只会返回true/false
        如果设置了对方服务器响应的内容都会原样的返回给你，以字符串形式*/
        curl_setopt($path,CURLOPT_RETURNTRANSFER,true);
        /*跳过证书检查https*/
        curl_setopt($path,CURLOPT_SSL_VERIFYPEER,false);
        curl_setopt($path, CURLOPT_SSL_VERIFYHOST,false);
        $res=curl_exec($path);
        curl_close($path);
        return $res;
    }
    //获取拍卖商品列表
    public function getActionGoods(){
        $data = db('t_trade')
            ->alias('g')
            ->join('t_auction a','g.tradeid = a.trade_id')
            ->where('g.goods_sale_type',2)
            ->field('g.tradeid id , g.imgurl img , g.tradename name , g.lookcount count , a.starttime time , a.currentprice price')
            ->limit(10)
            ->order('g.createtime desc')
            ->select();
        echo json_encode($data);
    }
    //获取商品活动详情
    public function getActionTradeDetails(){
        $page = input('?get.page')?input('page'):'';
        $user = input('?get.user')?input('user'):'';
        //将浏览记录+1
        db('t_trade')->where('tradeid',$page)->setInc('lookcount',1);
        $data = db('t_trade')
            ->alias('g')
            ->join('t_auction a','a.trade_id = g.tradeid')
            ->join('t_user u','u.userid = g.userid')
            ->join('degree d' ,'d.degreeid = g.tradedegree')
            ->where('g.tradeid',$page)
            ->limit(1)
            ->select();
        $today = (int)time();
        $start = (int)strtotime($data[0]['starttime']);
        $end = (int)strtotime($data[0]['endtime']);
        $mark =null;
        $state = 0;
        $res = db('t_tradeimages')->where('tradeid',$page)->select();
        //判断session
        if(isset($user)){
            $num = db('t_refund')->where(['userid'=>$user , 'tradeid' =>$page])->limit(1)->select();
            if(!empty($num)){
                $state = 1;
            }
        }
        $data[0]['usergps'] = $res;
        //活动是否结束判断
        if($today >= $start && $today <$end){
            //活动进行中
            $mark = 1;
        }else if($today < $start){
            //活动还没开始
            $mark = 2;
        }else{
            //活动结束
            $mark = 3;
        }
        $data[0]['sex']=$mark;
        $data[0]['birthday']=$state;
        echo json_encode($data);
    }
    //报名 提交保证金
    public function submitCash(){
        $user = input('?get.user')?input('user'):'';
        $cash = input('?get.cash')?input('cash'):'';
        $id = input('?get.goods')?input('goods'):'';
        $goods = db('t_auction')->where('trade_id',$id)->limit(1)->select();
        if((int)strtotime($goods[0]['endtime']) > (int)time()){
            $data = db('t_refund')->where(['userid' => $user , 'tradeid' => $id])->limit(1)->select();
            if(empty($data)){
                $res = db('t_refund')->insert([
                    'userid' => $user ,
                    'tradeid' => $id ,
                    'cash' => $cash ,
                    'createtime' => date('Y-m-d H:i:s',time()),
                    'state' => 0
                ]);
                if($res){
                    //查询交咯保证金人数
                    $countPeo = db('t_refund')->where('tradeid',$id)->count();
                    db('t_auction')->where('trade_id',$id)->update(['joinpeople' => $countPeo]);
                    echo json_encode(config('errorMsg')['actionGoods']['cash_ok']);
                }else{
                    //报名失败
                    echo json_encode(config('errorMsg')['actionGoods']['cash_fail']);
                }
            }else{
                echo json_encode(config('errorMsg')['actionGoods']['cash_ok']);
            }
        }else{
            echo json_encode(config('errorMsg')['actionGoods']['cash_over_time']);
        }
    }
    //拍卖加价
    public function addPriceUseRedis(){
        $id = input('?get.goodsId')?input('goodsId'):'';//商品id
        $add = input('?get.cash')?input('cash'):'';//加价金额
        $user = input('?get.user')?input('user'):'';//用户账号
        $start = input('?get.start')?input('start'):'';//拍卖开始时间
        $end = input('?get.end')?input('end'):'';//拍卖结束时间
        //判断拍卖商品是否结束
        $link = $this->redis();//创建redis
        $link->rPush('shopping',json_encode([$id,$add,$user,$start,$end]));//加价请求一个个加入队列
        $all = json_decode($link ->lPop('shopping'),true);//请求一个个出队列
        if((int)strtotime($all[3]) <= (int)time() && (int)strtotime($all[4]) > (int)time()){
            //拍卖进行中 拍卖商品表 加价记录表
            $data =[
                'a_userid' => $all[2] ,
                'a_tradeid' => $all[0] ,
                'a_price' => $all[1] ,
                'a_time' => date('Y-m-d H:i:s',time())
            ];
            $res = db('t_addpricerecord')->insert($data);
            if($res){
                db('t_auction')->where('trade_id' , $all[0])->setInc('currentprice' , $all[1]);
                echo json_encode(config('errorMsg')['actionGoods']['cash_add']);
            }
        }else if((int)strtotime($all[3]) > (int)time()){
            //拍卖即将开始
            echo json_encode(config('errorMsg')['actionGoods']['cash_wait_time']);
        }else{
            //拍卖已结束 加价失败
            echo json_encode(config('errorMsg')['actionGoods']['cash_over_time']);
        }
    }
    //创建redis连接
    public function redisOn(){
        $redis=new \Redis();
        $link=$redis->connect("127.0.0.1",6379);
        if($link){
            return $redis;
        }else{
            exit("连接失败");
        }
    }
    //获取用户信息
    public function getUser(){
        $user = input('?get.user')?input('user'):'';
        $res = db('t_user')->where(['userid'=>$user])->limit(1)->select();
        echo json_encode($res);
    }
}