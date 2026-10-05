(function () {
  'use strict';
  // E0 visual fixtures, not literal studio recipes. surface =
  // [radial relief, pore strength, visible inclusions, matte strength].
  // Formal materials will become a versioned content pack.
  window.PotteryClaySamples = [
    {
      id: 'warm-earth', name: '暖陶土', subtitle: '浅色陶土', tag: 'BUFF EARTHENWARE',
      wetDescription: '柔和湿润、细密泥纹，手捏后仍可塑。',
      firedDescription: '颜色烘暖，表面干燥、细颗粒可见。',
      wet: [0.66, 0.61, 0.54], fired: [0.82, 0.75, 0.66],
      texture: [0.90, 1.00, 0.04, 1.00],
      surface: [0.002, 0.18, 0.18, 0.55], feel: ['细密', '柔和']
    },
    {
      id: 'stoneware', name: '砂泥', subtitle: '砂质石器土', tag: 'GROGGED STONEWARE',
      wetDescription: '泥里含砂，捏起来就有颗粒与阻力。',
      firedDescription: '砂粒与孔隙仍清晰，表面保持粗糙。',
      wet: [0.57, 0.56, 0.52], fired: [0.74, 0.72, 0.66],
      texture: [1.35, 2.20, 0.015, 1.35],
      surface: [0.013, 0.72, 0.9, 0.92], feel: ['砂粒', '粗糙']
    },
    {
      id: 'porcelain', name: '白瓷', subtitle: '细白瓷坯', tag: 'PORCELAIN',
      wetDescription: '泥面细腻，底色柔和，带少量湿光。',
      firedDescription: '细密白瓷坯经磨光后带柔和反光；彩釉仍需另施。',
      wet: [0.72, 0.69, 0.64], fired: [0.86, 0.84, 0.77],
      texture: [0.58, 0.24, 0.62, 0.66],
      surface: [0.0005, 0.01, 0.015, 0.04], feel: ['细腻', '柔光']
    },
    {
      id: 'red-earth', name: '红陶土', subtitle: '含铁陶土', tag: 'TERRACOTTA',
      wetDescription: '含铁泥料带温暖的灰红调，仍有潮湿泥纹。',
      firedDescription: '烧成柔和赭红色，表面哑光且略有孔隙。',
      wet: [0.62, 0.50, 0.46], fired: [0.76, 0.57, 0.49],
      texture: [0.95, 1.18, 0.025, 0.98],
      surface: [0.004, 0.45, 0.18, 0.88], feel: ['孔隙', '哑光']
    },
    {
      id: 'coarse-earthenware', name: '夹砂粗陶', subtitle: '手筑低温陶', tag: 'COARSE EARTHENWARE',
      wetDescription: '粗泥中能看见砂粒，表面起伏明显。',
      firedDescription: '像未经修面的陶砖：粗砂、凹孔和不平整的哑光坯体。',
      wet: [0.56, 0.48, 0.43], fired: [0.68, 0.55, 0.46],
      texture: [1.40, 2.65, 0.005, 1.25],
      surface: [0.031, 1.35, 1.45, 1.00], feel: ['粗砂孔隙', '砖质哑光']
    }
  ];
}());
