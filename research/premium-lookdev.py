exec(bpy.data.texts['BSD_BUILD_LIB'].as_string())
import numpy as np
random.seed(42)
stone=mat('Travertine','ddd1b9',.72);dark=mat('Bronze','51473a',.32,.6);white=mat('Linen','eee5d5',.86);brass=mat('Brass','b78a4b',.3,.75);light=mat('Warm_LED','ffe6b5',.3,0,4)
# GLB 안에 넣을 수 있는 실제 이미지 텍스처. 외부 파일 참조 없이 생성 후 pack한다.
def texture_material(material,kind):
 size=256;yy,xx=np.mgrid[0:size,0:size];rng=np.random.default_rng(19)
 noise=rng.random((size,size));p=material.node_tree.nodes.get('Principled BSDF');base=np.array(p.inputs['Base Color'].default_value[:3])
 if material.name.startswith('Oak'):base=np.array([.105,.076,.054])*(.88+(sum(map(ord,material.name))%7)*.04)
 if kind=='wood':
  grain=np.sin(yy*.35+np.sin(xx*.025)*2+np.sin(xx*.067+yy*.012)*.8)*.05+np.sin(yy*1.9+xx*.013)*.018+(noise-.5)*.025
 elif kind=='stone':grain=np.sin(yy*.11+np.sin(xx*.025)*4)*.025+(noise-.5)*.045
 else:grain=(noise-.5)*.12+((xx%3==0)|(yy%3==0))*.03
 col=np.clip(base[None,None,:]*(1+grain[:,:,None]*2),0,1)
 # Blender 이미지 픽셀은 선형 RGBA로 저장하고 glTF 내보내기가 색 공간을 처리한다.
 pixels=np.concatenate([col,np.ones((size,size,1))],axis=2).astype(np.float32)
 image=bpy.data.images.new(material.name+'_albedo',width=size,height=size,alpha=True);image.pixels.foreach_set(pixels.ravel());image.pack()
 tex=material.node_tree.nodes.new('ShaderNodeTexImage');tex.image=image;material.node_tree.links.new(tex.outputs['Color'],p.inputs['Base Color'])
for m in list(bpy.data.materials):
 if m.name.startswith(('Oak','Walnut')):texture_material(m,'wood')
 elif m.name=='Travertine':texture_material(m,'stone')
 elif m.name in ['Boucle','Linen','Sage','Work_rug'] or m.name.endswith('_jacket'):texture_material(m,'fabric')
# 라운지 시야 보정: 긴 소파를 왼쪽에 두어 쿠션과 좌판이 보이게 한다.
for ob in list(bpy.data.objects):
 if ob.name.startswith(('PRP_sofa','PRP_pillow')):
  px,py,pz=ob.location;dx=px+5.7;dy=py+3.75;ob.location=(-7.55+dy,-3.45-dx,pz);ob.rotation_euler.z-=math.pi/2
 if ob.name.startswith('PRP_coffee_'):
  ob.location.x+=.25;ob.location.y-=.8
  if ob.name=='PRP_coffee_table':ob.rotation_euler.z=math.pi/2
# 통창 너머 석양을 담는 배경과 실제 깊이가 있는 도시 실루엣
def sky_panel(name,verts):
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],[(0,1,2,3)]);mesh.update()
 attr=mesh.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='CORNER')
 for i in range(4):attr.data[i].color=((.09,.19,.33,1) if i<2 else (.02,.09,.22,1))
 m=bpy.data.materials.get('Sky_gradient')
 if not m:
  m=bpy.data.materials.new('Sky_gradient');m.use_nodes=True;n=m.node_tree.nodes;p=n.get('Principled BSDF');p.inputs['Roughness'].default_value=1
  color=n.new('ShaderNodeVertexColor');color.layer_name='Color';m.node_tree.links.new(color.outputs['Color'],p.inputs['Base Color']);m.node_tree.links.new(color.outputs['Color'],p.inputs['Emission Color']);p.inputs['Emission Strength'].default_value=.7
 mesh.materials.append(m);o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o)
sky_panel('ENV_back_sky',[(-9.15,6.5,.25),(9.15,6.5,.25),(9.15,6.5,3.96),(-9.15,6.5,3.96)])
sky_panel('ENV_left_sky',[(-9.4,-6.2,.25),(-9.4,6.5,.25),(-9.4,6.5,3.96),(-9.4,-6.2,3.96)])
citym=[mat('City_'+str(i),c,.85,0,.2) for i,c in enumerate(['6c6e83','777586','837e8b','94858c'])]
windowmat=mat('City_windows','f5c58b',.5,0,1.4)
for i in range(25):
 x=-8.9+i*.73;h=random.uniform(.45,2.1);w=random.uniform(.35,.68)
 cube('ENV_city_tower',(x,6.4,.24+h/2),(w,.09,h),citym[i%4],.005)
 if i%3==0:cube('ENV_city_crown',(x,6.4,.24+h+.1),(w*.55,.09,.2),citym[i%4],.005)
 for r in range(int(h/.19)):
  for c in range(3):
   if random.random()>.35:cube('ENV_city_window',(x-w*.3+c*w*.3,6.34,.34+r*.19),(.035,.008,.045),windowmat,.001)
# 左側 패널은 뒤쪽보다 흐리게 유지해 공간 깊이를 분리
for i in range(14):
 y=-5.9+i*.85;h=random.uniform(.5,1.7)
 cube('ENV_left_city',(-9.31,y,.24+h/2),(.07,.6,h),citym[(i+2)%4],.004)
# 유리의 반사와 얇은 실링 스트립
glass=mat('Architectural_glass','b7d1d6',.12,.05)
p=glass.node_tree.nodes.get('Principled BSDF');p.inputs['Transmission Weight'].default_value=.65;p.inputs['Alpha'].default_value=.16
for i in range(8):cube('ENV_glass',(-8.05+i*2.3,6.28,2.1),(2.22,.015,3.65),glass,.0)
for y in [-5.15,-3.05,-.95,1.15,3.25,5.3]:cube('ENV_left_glass',(-9.18,y,2.1),(.015,2.02,3.65),glass,.0)
# 천장 없는 단면에서도 조명이 매달릴 수 있도록 얇은 구조 보를 추가
cube('ENV_lighting_rail',(-2,3.6,4.25),(8.5,.09,.09),dark,.02)
cube('ENV_meeting_rail',(6.15,-2.5,4.25),(2.2,.07,.07),dark,.02)
for x in [-7.2,3.2]:cube('ENV_column',(x,6.1,1.95),(.3,.3,3.9),stone,.06)
# 책장과 오브제는 옆 벽에 둔다.
cube('PRP_library_frame',(-8.85,2.9,1.15),(.45,2.2,2.3),mat('Walnut','714c32',.4),.04)
for z in [.35,1,1.65,2.2]:cube('PRP_library_shelf',(-8.56,2.9,z),(.55,2.2,.055),brass,.01)
for level,z in enumerate([.38,1.03,1.68]):
 for j in range(8):cube('PRP_book',(-8.53,2.05+j*.18,z+.16),(.36,.09,.32+random.random()*.12),[white,mat('Terracotta','b6664e',.85),mat('Sage','687c69',.8)][(j+level)%3],.008)
scene=bpy.context.scene;scene.render.resolution_x=1400;scene.render.resolution_y=1050
scene.view_settings.look='Medium High Contrast'
bpy.data.objects['LGT_key'].data.energy=3.4;bpy.data.objects['LGT_key'].data.angle=.23
bpy.data.objects['LGT_fill'].data.energy=3300
scene.world.node_tree.nodes.get('Background').inputs[0].default_value=(.12,.18,.29,1);scene.world.node_tree.nodes.get('Background').inputs[1].default_value=.65
target=artifacts.file(name='atelier-final.png',media_type='image/png');scene.render.filepath=str(target.path);scene.render.image_settings.media_type='IMAGE';scene.render.image_settings.file_format='PNG';bpy.ops.render.render(write_still=True);target.publish()
result={'textures':len([i for i in bpy.data.images if i.packed_file]),'objects':len(bpy.data.objects)}
