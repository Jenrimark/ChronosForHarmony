import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
/**
 * 动画工具类 - 统一的动画效果
 */
export class AnimationUtils {
    /**
     * 淡入动画配置
     */
    static fadeIn(duration: number = Constants.ANIMATION_DURATION_NORMAL): AnimateParam {
        return {
            duration: duration,
            curve: Curve.EaseOut,
            playMode: PlayMode.Normal
        };
    }
    /**
     * 淡出动画配置
     */
    static fadeOut(duration: number = Constants.ANIMATION_DURATION_NORMAL): AnimateParam {
        return {
            duration: duration,
            curve: Curve.EaseIn,
            playMode: PlayMode.Normal
        };
    }
    /**
     * 缩放动画配置
     */
    static scale(duration: number = Constants.ANIMATION_DURATION_FAST): AnimateParam {
        return {
            duration: duration,
            curve: Curve.EaseInOut,
            playMode: PlayMode.Normal
        };
    }
    /**
     * 弹性动画配置
     */
    static spring(): AnimateParam {
        return {
            duration: Constants.ANIMATION_DURATION_NORMAL,
            curve: Curve.EaseInOut,
            playMode: PlayMode.Normal
        };
    }
    /**
     * 滑入动画配置
     */
    static slideIn(duration: number = Constants.ANIMATION_DURATION_NORMAL): AnimateParam {
        return {
            duration: duration,
            curve: Curve.EaseOut,
            playMode: PlayMode.Normal
        };
    }
    /**
     * 滑出动画配置
     */
    static slideOut(duration: number = Constants.ANIMATION_DURATION_NORMAL): AnimateParam {
        return {
            duration: duration,
            curve: Curve.EaseIn,
            playMode: PlayMode.Normal
        };
    }
    /**
     * 平滑过渡动画配置
     */
    static smooth(duration: number = Constants.ANIMATION_DURATION_NORMAL): AnimateParam {
        return {
            duration: duration,
            curve: Curve.EaseInOut,
            playMode: PlayMode.Normal
        };
    }
}
/**
 * 页面转场动画配置
 */
export class PageTransitionUtils {
    /**
     * 右滑进入（从右向左）
     */
    static slideFromRight(): AnimateParam {
        return {
            duration: Constants.ANIMATION_DURATION_NORMAL,
            curve: Curve.EaseOut
        };
    }
    /**
     * 左滑退出（从左向右）
     */
    static slideToLeft(): AnimateParam {
        return {
            duration: Constants.ANIMATION_DURATION_NORMAL,
            curve: Curve.EaseIn
        };
    }
    /**
     * 淡入进入
     */
    static fadeInEnter(): AnimateParam {
        return {
            duration: Constants.ANIMATION_DURATION_NORMAL,
            curve: Curve.EaseOut
        };
    }
    /**
     * 淡出退出
     */
    static fadeOutExit(): AnimateParam {
        return {
            duration: Constants.ANIMATION_DURATION_NORMAL,
            curve: Curve.EaseIn
        };
    }
}
/**
 * 对话框动画配置
 */
export class DialogAnimationUtils {
    /**
     * 对话框弹出动画
     */
    static popIn(): TransitionEffect {
        return TransitionEffect.OPACITY
            .animation({
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseOut
        })
            .combine(TransitionEffect.scale({ x: 0.9, y: 0.9 })
            .animation({
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseOut
        }));
    }
    /**
     * 对话框关闭动画
     */
    static popOut(): TransitionEffect {
        return TransitionEffect.OPACITY
            .animation({
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseIn
        })
            .combine(TransitionEffect.scale({ x: 0.9, y: 0.9 })
            .animation({
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseIn
        }));
    }
    /**
     * 从底部滑入
     */
    static slideFromBottom(): TransitionEffect {
        return TransitionEffect.OPACITY
            .animation({
            duration: Constants.ANIMATION_DURATION_NORMAL,
            curve: Curve.EaseOut
        })
            .combine(TransitionEffect.translate({ y: 100 })
            .animation({
            duration: Constants.ANIMATION_DURATION_NORMAL,
            curve: Curve.EaseOut
        }));
    }
    /**
     * 滑到底部
     */
    static slideToBottom(): TransitionEffect {
        return TransitionEffect.OPACITY
            .animation({
            duration: Constants.ANIMATION_DURATION_NORMAL,
            curve: Curve.EaseIn
        })
            .combine(TransitionEffect.translate({ y: 100 })
            .animation({
            duration: Constants.ANIMATION_DURATION_NORMAL,
            curve: Curve.EaseIn
        }));
    }
}
/**
 * 列表项动画配置
 */
export class ListItemAnimationUtils {
    /**
     * 列表项进入动画
     */
    static itemEnter(index: number): TransitionEffect {
        return TransitionEffect.OPACITY
            .animation({
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseOut,
            delay: index * 50 // 错开动画，形成波浪效果
        })
            .combine(TransitionEffect.translate({ x: -20 })
            .animation({
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseOut,
            delay: index * 50
        }));
    }
    /**
     * 列表项删除动画
     */
    static itemDelete(): TransitionEffect {
        return TransitionEffect.OPACITY
            .animation({
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseIn
        })
            .combine(TransitionEffect.translate({ x: 100 })
            .animation({
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseIn
        }));
    }
    /**
     * 列表项完成动画（打勾效果）
     */
    static itemComplete(): AnimateParam {
        return {
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseInOut,
            playMode: PlayMode.Normal
        };
    }
}
/**
 * 加载动画配置
 */
export class LoadingAnimationUtils {
    /**
     * 骨架屏闪烁动画
     */
    static skeletonShimmer(): AnimateParam {
        return {
            duration: 1500,
            curve: Curve.Linear,
            iterations: -1,
            playMode: PlayMode.Normal
        };
    }
    /**
     * 旋转加载动画
     */
    static rotate(): AnimateParam {
        return {
            duration: 1000,
            curve: Curve.Linear,
            iterations: -1,
            playMode: PlayMode.Normal
        };
    }
    /**
     * 脉冲动画
     */
    static pulse(): AnimateParam {
        return {
            duration: 1000,
            curve: Curve.EaseInOut,
            iterations: -1,
            playMode: PlayMode.Alternate
        };
    }
}
/**
 * 按钮动画配置
 */
export class ButtonAnimationUtils {
    /**
     * 按钮按下动画
     */
    static press(): AnimateParam {
        return {
            duration: 100,
            curve: Curve.EaseOut,
            playMode: PlayMode.Normal
        };
    }
    /**
     * 按钮释放动画
     */
    static release(): AnimateParam {
        return {
            duration: 150,
            curve: Curve.EaseOut,
            playMode: PlayMode.Normal
        };
    }
    /**
     * 按钮悬停动画
     */
    static hover(): AnimateParam {
        return {
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseOut,
            playMode: PlayMode.Normal
        };
    }
}
/**
 * 卡片动画配置
 */
export class CardAnimationUtils {
    /**
     * 卡片悬停上浮效果
     */
    static hoverLift(): AnimateParam {
        return {
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseOut,
            playMode: PlayMode.Normal
        };
    }
    /**
     * 卡片点击反馈
     */
    static tap(): AnimateParam {
        return {
            duration: 100,
            curve: Curve.EaseOut,
            playMode: PlayMode.Normal
        };
    }
    /**
     * 卡片展开动画
     */
    static expand(): AnimateParam {
        return {
            duration: Constants.ANIMATION_DURATION_NORMAL,
            curve: Curve.EaseInOut,
            playMode: PlayMode.Normal
        };
    }
    /**
     * 卡片收起动画
     */
    static collapse(): AnimateParam {
        return {
            duration: Constants.ANIMATION_DURATION_NORMAL,
            curve: Curve.EaseInOut,
            playMode: PlayMode.Normal
        };
    }
}
/**
 * Toast 提示动画配置
 */
export class ToastAnimationUtils {
    /**
     * Toast 进入动画
     */
    static enter(): TransitionEffect {
        return TransitionEffect.OPACITY
            .animation({
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseOut
        })
            .combine(TransitionEffect.translate({ y: -20 })
            .animation({
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseOut
        }));
    }
    /**
     * Toast 退出动画
     */
    static exit(): TransitionEffect {
        return TransitionEffect.OPACITY
            .animation({
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseIn
        })
            .combine(TransitionEffect.translate({ y: -20 })
            .animation({
            duration: Constants.ANIMATION_DURATION_FAST,
            curve: Curve.EaseIn
        }));
    }
}
