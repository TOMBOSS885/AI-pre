# 线性回归与逻辑回归：资料核查笔记

核查日期：2026-09-12。范围：本科小组 15–20 分钟汇报。全部参考资料来自 Google ML Crash Course、scikit-learn 官方文档与 Stanford CS229；以下教学组织和数值示例为本项目整理。

## 一、建议覆盖范围

主线用同一种输入连接两个任务，例如“根据学习时长等特征预测考试分数”和“预测是否通过的概率”。这些仅是教学情境，不应宣称学习时长对成绩存在已证明的因果效应。

建议正文回答六个问题：预测什么 → 模型怎样表示 → 用什么衡量错误 → 参数怎样学习 → 输出怎样用于决策 → 怎样评价新样本上的表现。线性回归与逻辑回归都属于监督学习；前者常用于连续数值预测，后者本次只讲二分类概率建模与分类。

现场演示控制在两个短实验：①拖动直线，观察残差与损失，再执行若干次梯度更新；②固定概率模型，改变分类阈值，观察混淆矩阵。高级推导、多分类、正则化路径、ROC/AUC 等放入网页扩展，不挤占正文。

## 二、必须统一的数学规范

### 1. 线性回归的损失与梯度

设预测值 ŷᵢ = wxᵢ+b，误差 eᵢ = ŷᵢ−yᵢ。

| 写法 | 对 w 的梯度 | 对 b 的梯度 |
|---|---|---|
| MSE = (1/n)Σeᵢ² | (2/n)Σeᵢxᵢ | (2/n)Σeᵢ |
| J = ½MSE = (1/2n)Σeᵢ² | (1/n)Σeᵢxᵢ | (1/n)Σeᵢ |

两者在没有额外不同缩放项时具有相同最小点，但相同学习率对应的更新幅度不同。网页若显示 MSE，更新必须使用含 2 的梯度；若显示 J，清楚写出“训练目标 J=½MSE”，不能直接把 J 标成 MSE。w、b 都使用本轮旧值计算出的梯度，然后一起更新。梯度下降为 θ←θ−α∇J，α>0。

MSE 使大误差受到更强惩罚；残差在图中是同一 x 上的竖直偏差，不是点到直线的垂直最短距离。RMSE 与 y 同单位，MSE 是平方单位。[Google：Loss](https://developers.google.com/machine-learning/crash-course/linear-regression/loss)；[Google：Gradient descent](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent)。

注意：平方损失线性回归目标是凸函数，不等于任意学习率都能收敛；学习率过大会振荡或发散。梯度下降是求参数的方法之一，普通最小二乘也可用数值线性代数求解。[Stanford CS229](https://cs229.stanford.edu/main_notes.pdf#page=11)；[scikit-learn：Linear Models](https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares)。

### 2. 逻辑回归是一个整体模型

z=wᵀx+b；p=P(y=1|x)=σ(z)=1/(1+e^(−z))。有限 z 的理论输出严格在 (0,1)，且 σ(0)=0.5。线性的是 logit：ln[p/(1−p)]=wᵀx+b，不是概率 p 对 x 线性。[Google：Sigmoid](https://developers.google.com/machine-learning/crash-course/logistic-regression/sigmoid-function)。

无正则项的平均二元交叉熵：

J=−(1/n)Σ[yᵢ ln(pᵢ)+(1−yᵢ)ln(1−pᵢ)]。

对参数直接优化这个目标；不是先用普通最小二乘拟合 y，再把得到的直线套入 sigmoid。其概率依据是伯努利模型的负对数似然。虽然梯度外形与 ½MSE 类似，预测函数已经不同：∇wJ=(1/n)Σ(pᵢ−yᵢ)xᵢ，∂J/∂b=(1/n)Σ(pᵢ−yᵢ)。这些公式默认不含正则项和样本权重。[Google：Loss and regularization](https://developers.google.com/machine-learning/crash-course/logistic-regression/loss-regularization)；[Stanford CS229，PDF 第23–25页](https://cs229.stanford.edu/main_notes.pdf#page=23)。

可视化单样本损失的自算示例：y=1 时，p=0.9 的损失约 0.105；p=0.1 的损失约 2.303。解释为“自信地预测错会被重罚”。实现若对 p 做 epsilon 截断，应明确这是避免 log(0) 的数值保护，不是修改理论公式。

### 3. 阈值与边界的条件

明确约定 ŷ=1 当 p≥t，反之为 0；界面、混淆矩阵和示例对等号必须一致。固定模型后仅改变 t，不改变每个样本的 p，也不改变平均 LogLoss；它改变类别判断、TP/FP/FN/TN 和相应评价指标。应在验证集上选择阈值，不在最终测试集上调。[scikit-learn：Threshold tuning](https://scikit-learn.org/stable/modules/classification_threshold.html)。

由 sigmoid 单调性可直接推导：对 0<t<1，边界满足 wᵀx+b=ln[t/(1−t)]。当 t=0.5，右端为 0。在直接使用原始特征、w≠0 的标准模型中，这是仿射超平面；二维时是一条直线。一维只是分界点。若模型使用 x²、x₁x₂ 等非线性特征，边界在原始输入空间可以是曲线，不能一概说“逻辑回归只能画直线”。[Sigmoid 定义](https://developers.google.com/machine-learning/crash-course/logistic-regression/sigmoid-function)；[scikit-learn：特征扩展](https://scikit-learn.org/stable/modules/linear_model.html#polynomial-regression-extending-linear-models-with-basis-functions)。

阈值降低时，固定样本集上的预测正例只会增加或不变，Recall 不下降，FP 不减少；Precision 常见下降但不保证严格单调。不要把“调低阈值必然降低精确率”写成定理。

## 三、评价与数据流程核查

| 项目 | 正确口径与演示注意事项 |
|---|---|
| 回归 | 用 MAE/RMSE 解释偏差尺度，R²作为可选补充；训练误差不是泛化性能。 |
| R² | R²=1−Σ(yᵢ−ŷᵢ)²/Σ(yᵢ−ȳ)²，可为负，表示在该评价数据上比恒预测该数据均值的基线更差。真实 y 全相同会产生定义问题；scikit-learn 默认做有限值替换。不要写范围恒为[0,1]。 |
| 分类 | 正类要先定义；Precision=TP/(TP+FP)，Recall=TP/(TP+FN)，Accuracy=(TP+TN)/n。分母为0时显示“未定义/—”并说明，不悄悄产生NaN。 |
| 混淆矩阵 | 行列无唯一强制方向，但必须标注“实际/预测”，并与指标计算一致。类别不平衡时不能只看 Accuracy。 |
| 数据划分 | 先划分训练/验证/测试，再在训练数据拟合标准化等预处理。验证数据用于阈值与超参数选择，最终测试集保留到评价。Pipeline 有助于防止交叉验证中预处理泄漏。 |
| 教学数据 | 网页模拟点标注“教学合成数据”。在这些点上算出的指标用于说明概念，不包装成真实实验结论或测试集成绩。 |

依据：[scikit-learn：R²](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.r2_score.html)；[Google：分类指标](https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall)；[scikit-learn：数据泄漏](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage)。

## 四、10项一手资料与精确用途

| 编号 | 资料 | 支持结论 / 建议用途 |
|---|---|---|
| S1 | [Google MLCC — Linear regression: Loss](https://developers.google.com/machine-learning/crash-course/linear-regression/loss) | MSE/MAE/RMSE定义、平方误差与异常值；线性回归损失页。 |
| S2 | [Google MLCC — Gradient descent](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent) | MSE对应的含2梯度、负梯度更新与损失曲线。 |
| S3 | [Google MLCC — Sigmoid function](https://developers.google.com/machine-learning/crash-course/logistic-regression/sigmoid-function) | 线性得分、sigmoid概率、log-odds关系；概率交互页。 |
| S4 | [Google MLCC — Loss and regularization](https://developers.google.com/machine-learning/crash-course/logistic-regression/loss-regularization) | 平均LogLoss公式、正则化概念；损失交互和扩展阅读。 |
| S5 | [Stanford CS229 — Main Notes](https://cs229.stanford.edu/main_notes.pdf) | Part I：平方目标中的½、最小二乘求解；Part II：伯努利似然、逻辑回归梯度。网页提供推导扩展。 |
| S6 | [scikit-learn — Linear Models](https://scikit-learn.org/stable/modules/linear_model.html) | 普通最小二乘、逻辑回归的分类用途与概率公式、正则化及非线性基函数扩展。 |
| S7 | [scikit-learn — Tuning the decision threshold](https://scikit-learn.org/stable/modules/classification_threshold.html) | 区分概率估计与决策；阈值变化后predict_proba不变；阈值选择避免过拟合。 |
| S8 | [Google MLCC — Accuracy, recall, precision](https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall) | 分类指标公式、类别不平衡下准确率局限。 |
| S9 | [scikit-learn — r2_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.r2_score.html) | R²可负、常数标签特殊情况。 |
| S10 | [scikit-learn — Common pitfalls / Data leakage](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage) | 先划分、只在训练数据fit预处理、Pipeline防泄漏。 |

## 五、给制作人的措辞提醒

- 不要说“机器学习找到因果关系”；说“学习特征与目标的统计关系”。
- 不要说“逻辑回归先做线性回归”；说“先计算线性得分，再用 sigmoid 得到概率，整体参数由分类损失训练”。
- 不要说“有了 sigmoid 就能处理任意非线性分类”；区分概率曲线与输入空间决策边界。
- 不要说“阈值提高使模型更有信心”；说“判定为正类的条件更严格”。
- 不要说“凸函数保证随便选学习率都能找到最优”；加上合适学习率与收敛条件。
- 不要照搬S4中关于平方损失与内存精度的简化解释；选用伯努利负对数似然与错判惩罚解释交叉熵。
- 避免在15–20分钟内堆满指标；主讲RMSE、Precision与Recall即可，其余留网页。
