# 线性回归与逻辑回归：PPT大纲

面向本科初学者，14页、18分钟。PPT正文只保留讲述目标、思路要点和待补图表，不在本版填充详细公式推导或未经运行的实验结果。逐页口语稿见《逐页汇报稿.md》。

贯穿案例：学习时长→考试分数 / 是否通过；二维扩展加入练习完成率。全部为教学模拟，不代表真实教育规律。分类统一约定：通过=1=正类，未通过=0=负类；概率p≥阈值τ时预测通过。

## 01｜两个预测问题

**时间：45秒｜累计 0:00—0:45**

**讲述目标：**用同一个场景区分连续数值预测与二分类，明确本次汇报主线。

**思路要点：**

- 情境一：根据学习时长预测考试分数
- 情境二：根据学习时长预测是否通过
- 先判断输出是什么，再选择模型

**待补图表与内容：**同一张教学模拟学生数据卡，分成“预测分数”和“预测通过概率”两条分支；页脚注明教学模拟，非真实教育规律。

**讲述/演示提示：**停留在两张问题卡上，强调“数值”和“类别”；不先展示公式。

**备课来源：**[Google MLCC：线性回归](https://developers.google.com/machine-learning/crash-course/linear-regression)；[Google MLCC：逻辑回归](https://developers.google.com/machine-learning/crash-course/logistic-regression)

## 02｜共同的学习流程

**时间：45秒｜累计 0:45—1:30**

**讲述目标：**建立特征、标签、参数、损失和训练的共同词汇。

**思路要点：**

- 输入特征与目标标签：模型从什么预测什么
- 模型给出预测，损失衡量预测与标签的差距
- 训练调整参数，最后用未见数据评价

**待补图表与内容：**数据→模型→预测→损失→更新参数的循环图，测试集在循环外单独评价。

**讲述/演示提示：**沿流程图顺序指示；“测试集在训练循环外”只点明，不在此展开数据泄漏。

**备课来源：**[Google MLCC：线性回归](https://developers.google.com/machine-learning/crash-course/linear-regression)；[scikit-learn：常见陷阱与数据泄漏](https://scikit-learn.org/stable/common_pitfalls.html)

## 03｜线性回归的模型

**时间：75秒｜累计 1:30—2:45**

**讲述目标：**把散点图中的直线与线性回归参数对应起来。

**思路要点：**

- 单特征模型：用一条直线近似特征与数值目标的关系
- 斜率决定变化方向和速度，截距决定整体位置
- 扩展到多个特征，理解“对参数线性”的含义

**待补图表与内容：**学习时长—分数散点图、一条预测直线，以及斜率/截距的可编辑标注；只保留一行核心模型公式。

**讲述/演示提示：**先看图再解释参数；若本页临近75秒，略去“对参数线性”的补充例子。

**备课来源：**[Google MLCC：线性回归](https://developers.google.com/machine-learning/crash-course/linear-regression)；[scikit-learn：线性模型](https://scikit-learn.org/stable/modules/linear_model.html)

## 04｜残差与均方误差

**时间：90秒｜累计 2:45—4:15**

**讲述目标：**从点到直线的竖直差距建立残差与MSE的直观认识。

**思路要点：**

- 残差：同一个输入位置上，预测值减真实值
- 平方后求平均，避免正负抵消并强调较大偏差
- 拖动参数，观察拟合直线、残差和MSE一起变化

**待补图表与内容：**残差竖线、MSE数值与参数滑块的网页截图；保留35秒交互演示。

**讲述/演示提示：**网页演示35秒：打开线性回归模块；调整截距约10秒、调整斜率约10秒；指出残差与MSE联动约10秒；恢复默认并转回PPT约5秒。

**备课来源：**[Google MLCC：损失函数](https://developers.google.com/machine-learning/crash-course/linear-regression/loss)

## 05｜梯度下降如何学习

**时间：100秒｜累计 4:15—5:55**

**讲述目标：**理解梯度下降的方向、步长与反复更新过程。

**思路要点：**

- 把损失想象成地形高度，参数决定当前位置
- 沿负梯度方向更新，学习率控制每次走多远
- 对比合适和过大的学习率；区分模型与求解方法

**待补图表与内容：**损失曲线与当前参数点、正常/过大学习率对照；保留40秒交互演示。

**讲述/演示提示：**网页演示40秒：重置后以正常学习率运行约15秒；重置后选过大学习率运行约15秒；比较损失轨迹并恢复约10秒。不要在台上等待训练很久。

**备课来源：**[Google MLCC：梯度下降](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent)；[Google MLCC：学习率与超参数](https://developers.google.com/machine-learning/crash-course/linear-regression/hyperparameters)；[scikit-learn：线性模型](https://scikit-learn.org/stable/modules/linear_model.html)

## 06｜从分数走向分类

**时间：50秒｜累计 5:55—6:45**

**讲述目标：**说明为什么二分类需要与数值回归不同的输出和训练方式。

**思路要点：**

- 将标签换成通过1、未通过0，明确正类定义
- 无约束直线输出可能小于0或大于1
- 逻辑回归直接建模类别概率，再通过阈值作决定

**待补图表与内容：**连续分数轴与0/1标签轴并排；用越过0和1的直线引出概率映射。

**讲述/演示提示：**保持“通过=正类”标注，后续混淆矩阵与阈值演示沿用同一定义。

**备课来源：**[Google MLCC：逻辑回归](https://developers.google.com/machine-learning/crash-course/logistic-regression)；[Google MLCC：Sigmoid概率映射](https://developers.google.com/machine-learning/crash-course/logistic-regression/sigmoid-function)

## 07｜Sigmoid与概率

**时间：90秒｜累计 6:45—8:15**

**讲述目标：**看懂线性分数到概率的S形映射，并区分概率与最终类别。

**思路要点：**

- 先计算线性分数z，再用Sigmoid映射为概率p
- z为0时p为0.5；正负方向分别靠近1和0
- 概率是模型估计，是否可信仍需要检验

**待补图表与内容：**Sigmoid曲线与z、p联动读数；保留30秒交互演示。

**讲述/演示提示：**网页演示30秒：选择z=0，指出p=0.5；分别向正负方向拖动；指出曲线中段与两端变化；不要把概率读作分数。

**备课来源：**[Google MLCC：Sigmoid概率映射](https://developers.google.com/machine-learning/crash-course/logistic-regression/sigmoid-function)；[scikit-learn：概率校准](https://scikit-learn.org/stable/modules/calibration.html)

## 08｜交叉熵如何训练

**时间：75秒｜累计 8:15—9:30**

**讲述目标：**用“为真实结果分配概率”的视角理解二元交叉熵。

**思路要点：**

- 真实标签为1时，鼓励预测概率接近1；为0时反过来
- 对自信却错误的预测给予较大惩罚
- 以二元交叉熵为目标更新参数，可加入正则化

**待补图表与内容：**真实标签为1时的三个预测概率及损失对照卡；公式推导留作课后补充。

**讲述/演示提示：**只比较三张概率卡，不逐项展开对数计算；强调“训练概率”和“选分类阈值”是两步。

**备课来源：**[Google MLCC：对数损失与正则化](https://developers.google.com/machine-learning/crash-course/logistic-regression/loss-regularization)；[scikit-learn：线性模型](https://scikit-learn.org/stable/modules/linear_model.html)

## 09｜阈值与混淆矩阵

**时间：100秒｜累计 9:30—11:10**

**讲述目标：**理解从概率到类别的阈值规则及两类错误的变化。

**思路要点：**

- 约定p≥阈值判为通过，0.5只是常见起点
- 混淆矩阵区分TP、FP、FN、TN
- 固定模型改变阈值，观察取舍；阈值应在验证集选择

**待补图表与内容：**阈值滑块、概率样本带、带中文含义的混淆矩阵；保留35秒交互演示。

**讲述/演示提示：**网页演示35秒：阈值按0.5→0.3→0.7切换，每次指出预测类别与矩阵联动；强调概率本身未变；最后恢复0.5。

**备课来源：**[Google MLCC：阈值与混淆矩阵](https://developers.google.com/machine-learning/crash-course/classification/thresholding)；[scikit-learn：常见陷阱与数据泄漏](https://scikit-learn.org/stable/common_pitfalls.html)

## 10｜二维决策边界

**时间：100秒｜累计 11:10—12:50**

**讲述目标：**用二维图解释逻辑回归为何具有线性决策边界。

**思路要点：**

- 增加练习完成率，让两个特征组成二维平面
- 固定阈值对应一条线性决策边界
- Sigmoid是曲线，不意味着原始特征中的边界会弯曲

**待补图表与内容：**学习时长×练习完成率的模拟散点图，直线边界与两侧概率背景；再放一张需要弯曲边界的数据示意图。

**讲述/演示提示：**不增加网页操作时长；使用预先截取的默认边界图。按“特征平面→直线→非线性反例”依次讲解。

**备课来源：**[Google MLCC：Sigmoid概率映射](https://developers.google.com/machine-learning/crash-course/logistic-regression/sigmoid-function)；[scikit-learn：线性模型](https://scikit-learn.org/stable/modules/linear_model.html)

## 11｜两种任务怎样评价

**时间：90秒｜累计 12:50—14:20**

**讲述目标：**按照预测任务选择指标，避免准确率与R²的常见误读。

**思路要点：**

- 回归：MAE/RMSE回答数值误差大小，R²与均值基线比较
- 分类：准确率结合精确率、召回率和F1理解
- 区分类别决策质量与概率质量，避免单指标结论

**待补图表与内容：**回归/分类指标对照表；另用100个教学模拟样本展示类别不平衡的准确率陷阱。

**讲述/演示提示：**明确精确率/召回率仍以“通过”为正类；R²负值只讲一句，不推导。

**备课来源：**[Google MLCC：分类评价指标](https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall)；[scikit-learn：模型评价](https://scikit-learn.org/stable/modules/model_evaluation.html)

## 12｜一次规范的建模实验

**时间：90秒｜累计 14:20—15:50**

**讲述目标：**给出可以照着完成的实验流程，并建立可信评价边界。

**思路要点：**

- 固定教学模拟数据，先划分训练/验证/测试集并建立基线
- 预处理只拟合训练集，训练模型与验证选参
- 最后使用测试集一次报告结果，记录数据与设置

**待补图表与内容：**分区数据流程图和空白结果表；填写位置包括划分方式、随机种子、特征、超参数、阈值与评价指标，未运行处标“待运行”。

**讲述/演示提示：**展示空白结果表时把“待运行”标清楚；强调先划分、再拟合预处理。

**备课来源：**[scikit-learn：常见陷阱与数据泄漏](https://scikit-learn.org/stable/common_pitfalls.html)；[scikit-learn：交叉验证与数据划分](https://scikit-learn.org/stable/modules/cross_validation.html)

## 13｜算法对照与适用边界

**时间：60秒｜累计 15:50—16:50**

**讲述目标：**用统一框架对照两个算法，并说明它们适合作为基线的原因。

**思路要点：**

- 共同点：线性加权、参数学习、可作为可解释的基础模型
- 不同点：目标、输出含义、训练损失与评价指标
- 限制：异常值、特征关系、正则化、概率校准与外推

**待补图表与内容：**两列算法对照表；页底放“先做基线，再验证是否需要更复杂模型”的一句结论。

**讲述/演示提示：**按“共同点→核心不同→何时不够用”读表，不逐字朗读整张表。

**备课来源：**[scikit-learn：线性模型](https://scikit-learn.org/stable/modules/linear_model.html)；[Google MLCC：损失函数](https://developers.google.com/machine-learning/crash-course/linear-regression/loss)；[scikit-learn：概率校准](https://scikit-learn.org/stable/modules/calibration.html)

## 14｜总结与提问

**时间：70秒｜累计 16:50—18:00**

**讲述目标：**用三道判断题回收知识，给出一条完整方法链。

**思路要点：**

- 预测多少：线性回归；预测类别概率：逻辑回归
- 模型→损失→优化→决策→评价，串起完整学习过程
- 以短问题复盘，并为20分钟版本预留问答扩展

**待补图表与内容：**三道口头快问卡和一条算法流程箭头；参考资料放页脚或备注。

**讲述/演示提示：**三个问题每题停顿约3秒；标准18分钟版到此结束，20分钟版另留2分钟回答问题。

**备课来源：**[Google MLCC：线性回归](https://developers.google.com/machine-learning/crash-course/linear-regression)；[Google MLCC：逻辑回归](https://developers.google.com/machine-learning/crash-course/logistic-regression)；[Google MLCC：阈值与混淆矩阵](https://developers.google.com/machine-learning/crash-course/classification/thresholding)

## 填充正文时的统一规则

- 一页只服务于一个讲述目标；优先用图、少量标注与结论句表达。
- 第3、4、7、8页可以补核心公式，但详细推导放学习网页或备用材料。
- 第4、5、7、9页演示总预算140秒，包含进入模块、操作与切回PPT。
- 第12页结果表先保留“待运行”；补充实测数据后注明数据来源、划分、随机种子和指标。
- 演讲者备注可以放完整讲稿和来源，观众可见正文只放大纲。

