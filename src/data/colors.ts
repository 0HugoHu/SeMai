import type { TraditionalColor } from "@/lib/types";

// Red family (红)
import dahong from "./colors/da-hong.json";
import zhusha from "./colors/zhu-sha.json";
import yanzhi from "./colors/yan-zhi.json";
import yinzhu from "./colors/yin-zhu.json";
import feise from "./colors/fei-se.json";
import shiliuhong from "./colors/shi-liu-hong.json";
import chi from "./colors/chi.json";
import qianse from "./colors/qian-se.json";
import haitanghong from "./colors/hai-tang-hong.json";
import jiangzi from "./colors/jiang-zi.json";
import zhuhong from "./colors/zhu-hong.json";

// Orange family (橙)
import xinghuang from "./colors/xing-huang.json";
import juhong from "./colors/ju-hong.json";
import hupo from "./colors/hu-po.json";
import xionghuang from "./colors/xiong-huang.json";
import mihe from "./colors/mi-he.json";

// Yellow family (黄)
import minghuang from "./colors/ming-huang.json";
import ehuang from "./colors/e-huang.json";
import tenghuang from "./colors/teng-huang.json";
import jianghuang from "./colors/jiang-huang.json";
import xiangse from "./colors/xiang-se.json";
import zhehuang from "./colors/zhe-huang.json";
import cihuang from "./colors/ci-huang.json";
import qiuxiang from "./colors/qiu-xiang.json";
import songhuahuang from "./colors/song-hua-huang.json";

// Green family (绿)
import songhalv from "./colors/song-hua-lv.json";
import qingbi from "./colors/qing-bi.json";
import shilv from "./colors/shi-lv.json";
import cuilv from "./colors/cui-lv.json";
import zhuqing from "./colors/zhu-qing.json";
import doulv from "./colors/dou-lv.json";
import ailv from "./colors/ai-lv.json";
import liulv from "./colors/liu-lv.json";

// Cyan/Teal family (青)
import tianqing from "./colors/tian-qing.json";
import yaqing from "./colors/ya-qing.json";
import bise from "./colors/bi-se.json";
import tonglv from "./colors/tong-lv.json";
import qingbai from "./colors/qing-bai.json";
import feicui from "./colors/fei-cui.json";

// Blue family (蓝)
import dianlan from "./colors/dian-lan.json";
import qunqing from "./colors/qun-qing.json";
import huaqing from "./colors/hua-qing.json";
import baolan from "./colors/bao-lan.json";
import canglan from "./colors/cang-lan.json";
import yuebai from "./colors/yue-bai.json";

// Purple family (紫)
import fengxinzi from "./colors/feng-xin-zi.json";
import zitang from "./colors/zi-tang.json";
import dingxiang from "./colors/ding-xiang.json";
import xueqing from "./colors/xue-qing.json";
import ouse from "./colors/ou-se.json";
import qinglian from "./colors/qing-lian.json";

// White family (白)
import subai from "./colors/su-bai.json";
import shuangse from "./colors/shuang-se.json";
import gao from "./colors/gao.json";
import jingbai from "./colors/jing-bai.json";
import yadanbai from "./colors/ya-dan-bai.json";

// Black family (黑)
import xuanse from "./colors/xuan-se.json";
import mose from "./colors/mo-se.json";
import qihei from "./colors/qi-hei.json";
import dai from "./colors/dai.json";

// Brown/Earth family (棕)
import zheshi from "./colors/zhe-shi.json";
import lise from "./colors/li-se.json";
import tuose from "./colors/tuo-se.json";
import tanse from "./colors/tan-se.json";
import qiuse from "./colors/qiu-se.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
const colors: TraditionalColor[] = ([
  // Red family (红)
  dahong,
  zhusha,
  yanzhi,
  yinzhu,
  feise,
  shiliuhong,
  chi,
  qianse,
  haitanghong,
  jiangzi,
  zhuhong,

  // Orange family (橙)
  xinghuang,
  juhong,
  hupo,
  xionghuang,
  mihe,

  // Yellow family (黄)
  minghuang,
  ehuang,
  tenghuang,
  jianghuang,
  xiangse,
  zhehuang,
  cihuang,
  qiuxiang,
  songhuahuang,

  // Green family (绿)
  songhalv,
  qingbi,
  shilv,
  cuilv,
  zhuqing,
  doulv,
  ailv,
  liulv,

  // Cyan/Teal family (青)
  tianqing,
  yaqing,
  bise,
  tonglv,
  qingbai,
  feicui,

  // Blue family (蓝)
  dianlan,
  qunqing,
  huaqing,
  baolan,
  canglan,
  yuebai,

  // Purple family (紫)
  fengxinzi,
  zitang,
  dingxiang,
  xueqing,
  ouse,
  qinglian,

  // White family (白)
  subai,
  shuangse,
  gao,
  jingbai,
  yadanbai,

  // Black family (黑)
  xuanse,
  mose,
  qihei,
  dai,

  // Brown/Earth family (棕)
  zheshi,
  lise,
  tuose,
  tanse,
  qiuse,
] as any) as TraditionalColor[];

export default colors;
