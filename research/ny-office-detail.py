# 원본 구도를 통과한 공간의 가구·재질·식물 상세 제작. Higgsfield 전용.
exec(bpy.data.texts['BSD_BUILD_LIB'].as_string())
random.seed(42)
def box(n,x,z,h,w,d,t,m,b=.03):return cube(n,(x,-z,h),(w,d,t),m,b)
def ball(n,x,z,h,s,m):return uv(n,(x,-z,h),s,m)
def rod(n,pts,r,m):return line(n,[(x,-z,h) for x,z,h in pts],r,m)
def cylinder(n,x,z,h,r,d,m,r2=None):return cyl(n,(x,-z,h),r,d,m,r2)
ivory=mat('NY_Ivory','e7e4dc',.5);walnut=mat('NY_Walnut','644832',.48);metal=mat('NY_Metal','27333e',.32,.7)
blue=mat('NY_Blue','365d77',.85);terra=mat('NY_Terra','ad5c44',.82);green=mat('NY_Green','547454',.8);light=mat('NY_Light','ffe3ad',.3,0,3)
brass=mat('NY_Brass','a78450',.28,.8);black=mat('NY_Black','171d24',.44);leather=mat('NY_Leather','49372b',.7);rug=mat('NY_Rug','777b81',.96)
screen=mat('NY_Screen','4b8fb0',.35,0,.55);pink=mat('NY_Screen_pink','e7ae9b',.4,0,.6);pale=mat('NY_Screen_light','bee0e3',.5,0,.6)
leafm=[mat('NY_Leaf'+str(i),c,.72) for i,c in enumerate(['244c25','3e672f','5f7b36','80934a'])]
# 내장된 색상 맵은 GLB에 패킹하므로 웹에서도 같은 결이 보인다.
import numpy as np
def texture(m,kind):
 size=256;yy,xx=np.mgrid[0:size,0:size];rng=np.random.default_rng(8);noise=rng.random((size,size))
 p=m.node_tree.nodes.get('Principled BSDF');base=np.array(p.inputs['Base Color'].default_value[:3]);base=np.where(base<.0031308,base*12.92,1.055*np.power(base,1/2.4)-.055)
 if kind=='wood':v=.82+.10*np.sin(yy*.9+np.sin(xx*.027)*3)+.1*noise
 elif kind=='marble':v=.95-.18*np.exp(-((np.sin(xx*.037+np.sin(yy*.045)*1.7))/.08)**2)
 else:v=.9+.1*noise+.025*np.sin(xx*math.pi/2)*np.sin(yy*math.pi/2)
 data=np.ones((size,size,4),dtype=np.float32);data[:,:,:3]=np.clip(base[None,None,:]*v[:,:,None],0,1)
 im=bpy.data.images.new(m.name+'_packed',width=size,height=size);im.pixels.foreach_set(data.ravel());im.pack()
 t=m.node_tree.nodes.new('ShaderNodeTexImage');t.image=im;m.node_tree.links.new(t.outputs['Color'],p.inputs['Base Color'])
for name,kind in [('NY_Charcoal_oak','wood'),('NY_Walnut','wood'),('NY_Ivory','marble'),('NY_Leather','cloth'),('NY_Blue','cloth'),('NY_Terra','cloth'),('NY_Green','cloth'),('NY_Rug','cloth')]:texture(bpy.data.materials[name],kind)
# 널빤지 경계와 계단 난간.
for i in range(57):rod('ENV_plank_seam',[(-13.9,-9.9+i*.33,.046),(10.9,-9.9+i*.33,.046)],.006,black)
for i in range(56):
 for j in range(6):
  x=-13.9+(j+.5*(i%2))*4.15
  rod('ENV_plank_end',[(x,-9.9+i*.33,.047),(x,-9.57+i*.33,.047)],.004,black)
for x in [-13.55,-11.35]:
 rod('STAIRS_rail',[(x,3.05,1.05),(x,-1.4,2.85)],.035,metal)
 for i in range(0,12,3):rod('STAIRS_rail_post',[(x,2.9-i*.38,.15+i*.16),(x,2.9-i*.38,1.1+i*.16)],.025,metal)
def chair(x,z,m,angle=math.pi,office=True):
 before=set(bpy.data.objects)
 box('PRP_chair_seat',0,0,.54,.64,.61,.14,m,.1)
 box('PRP_chair_back',0,-.27,.93,.66,.13,.75,m,.14)
 box('PRP_chair_inset',0,-.18,.96,.53,.065,.51,m,.12)
 for s in [-1,1]:
  rod('PRP_chair_arm',[(s*.35,0,.54),(s*.35,-.1,.78),(s*.35,.22,.78)],.022,black)
  box('PRP_armrest',s*.35,.06,.8,.07,.34,.04,black,.02)
 cylinder('PRP_piston',0,0,.32,.045,.33,metal)
 for i in range(5):
  a=i*math.tau/5;dx=math.cos(a)*.36;dz=math.sin(a)*.36
  rod('PRP_chair_spoke',[(0,0,.17),(dx,dz,.11)],.025,metal);ball('PRP_wheel',dx,dz,.1,(.055,.055,.055),black)
 for o in set(bpy.data.objects)-before:
  px,py,pz=o.location;o.location=(x+px*math.cos(angle)-py*math.sin(angle),-z+px*math.sin(angle)+py*math.cos(angle),pz);o.rotation_euler.z+=angle
def lamp(x,z,h=1):
 cylinder('PRP_lamp_base',x,z,h,.12,.035,brass)
 rod('PRP_lamp_arm',[(x,z,h),(x,z,h+.45),(x+.13,z,h+.57)],.017,brass)
 cylinder('PRP_lamp_glow',x+.13,z,h+.56,.1,.16,light,r2=.065)
def monitor(x,z,h=1.34):
 box('PRP_monitor_frame',x,z,h,.84,.065,.52,black,.026)
 box('PRP_monitor_glass',x,z+.039,h,.785,.012,.455,screen,.012)
 box('PRP_monitor_stand',x,z-.03,h-.29,.04,.05,.18,metal,.008)
 box('PRP_monitor_base',x,z+.02,h-.39,.29,.21,.028,metal,.015)
 # 3D 화면 속 창과 작은 코드 줄.
 box('PRP_screen_panel',x-.23,z+.047,h,.23,.005,.4,blue,.003)
 for i in range(5):box('PRP_screen_content',x+.08,z+.048,h+.13-i*.065,.29-i%2*.09,.004,.012,pale if i%2 else pink,.001)
def desktop(x,z):
 for offset in [-.44,.44]:monitor(x+offset,z-.15)
 box('PRP_keyboard',x-.1,z+.25,1.003,.66,.24,.035,black,.018)
 for row in range(3):
  for j in range(10):box('PRP_key',x-.38+j*.06,z+.17+row*.065,1.027,.044,.043,.009,ivory,.003)
 ball('PRP_mouse',x+.42,z+.24,1.023,(.065,.1,.025),ivory)
 box('PRP_computer',x+.63,z-.02,.37,.25,.53,.6,black,.025)
 cylinder('PRP_cup',x-.72,z+.2,1.06,.06,.13,ivory)
benches=[('devA',-.65,-7.1,blue),('devB',2.75,-1.8,blue),('planA',-2.9,2.35,terra),('planB',4.9,3.1,terra),('ops',8.05,-3,green)]
for n,x,z,m in benches:
 for sx in [-.95,.95]:desktop(x+sx,z);chair(x+sx,z+.9,m)
 lamp(x-1.95,z-.18,1.0)
 for h in [.3,.53,.75]:box('PRP_drawer',x+1.92,z,h,.32,.82,.18,ivory,.025)
 for side in [-1,1]:box('PRP_desk_slats',x+side*2.1,z,.5,.025,.7,.7,walnut,.01)
for i,x in enumerate([-5,-3.6,-2.2]):
 chair(x,-1.05,terra);chair(x,-3.55,terra,0)
for x in [-5.95,-1.25]:chair(x,-2.3,terra,math.pi/2 if x< -3 else -math.pi/2)
for x in [-4.4,-2.9]:
 box('PRP_meeting_book',x,-2.3,.92,.42,.51,.035,walnut,.012);cylinder('PRP_meeting_cup',x+.34,-2.2,.98,.06,.14,ivory)
box('WHITEBOARD',-4.8,-4.2,1.55,2.4,.1,1.15,ivory,.035)
for x in [-5.8,-3.8]:rod('PRP_whiteboard_leg',[(x,-4.2,.1),(x,-4.2,1.55)],.035,metal)
# 부드러운 가죽 소파, 패브릭 쿠션, 빈백, 테이블 다리.
for x in [-10,-6.6]:box('PRP_sofa_arm',x,-5,.74,.3,1.24,.74,leather,.13)
for x in [-9.43,-8.3,-7.17]:
 box('PRP_sofa_seat',x,-4.88,.61,1.07,.92,.23,leather,.11)
 box('PRP_sofa_back_cushion',x,-5.34,.97,1.07,.28,.73,leather,.12)
for x,m in [(-9.6,green),(-7.0,terra)]:
 o=box('PRP_pillow',x,-5.12,1.0,.52,.2,.52,m,.12);o.rotation_euler.y=.18
for x in [-8.9,-7.7]:cylinder('PRP_coffee_leg',x,-3.25,.27,.09,.48,walnut)
for x,z,m in [(-9.45,-2.5,terra),(-7.8,-1.85,green)]:
 ball('PRP_beanbag',x,z,.33,(.6,.56,.32),m);ball('PRP_beanbag_back',x,z-.23,.48,(.53,.26,.23),m)
# 탕비와 실제 유리문 냉장고, 병, 잔, 커피 머신.
box('PANTRY_cabinet',-12,-5.2,.5,2.3,.74,1,walnut,.04)
box('PANTRY_top',-12,-5.2,1.03,2.4,.8,.08,ivory,.03)
box('PANTRY_fridge',-13.1,-3.9,.93,.75,.72,1.86,black,.06)
box('PANTRY_fridge_inner',-13.1,-3.52,.98,.61,.02,1.54,blue,.015)
for h in [.43,.85,1.25,1.65]:
 box('PRP_fridge_shelf',-13.1,-3.5,h,.62,.03,.03,ivory,.004)
 for j in range(4):cylinder('PRP_bottle',-13.32+j*.145,-3.46,h+.12,.045,.2,[green,pink,light,terra][j])
box('PRP_espresso',-12.2,-5.2,1.34,.6,.5,.52,metal,.05)
box('PRP_espresso_plate',-12.2,-4.935,1.38,.48,.025,.3,brass,.02)
for x in [-12.35,-12.05]:cylinder('PRP_cup',x,-4.85,1.14,.05,.1,ivory)
for x in [-10.3,-8.8,-7.3,-5.8]:
 cylinder('BAR_stool',x,-8.15,.76,.28,.13,terra);cylinder('BAR_stool_leg',x,-8.15,.4,.035,.7,metal)
 for side in [-1,1]:rod('BAR_stool_foot',[(x,-8.15,.16),(x+side*.22,-8.15,.08)],.022,metal)
for x in [-10.1,-7.7,-5.2]:
 rod('PRP_pendant_wire',[(x,-9.25,4),(x,-9.25,2.9)],.012,metal);ball('PRP_pendant',x,-9.25,2.75,(.16,.16,.21),light)
# 우측 대표실: 깊이가 있는 책장과 수십 권의 책.
box('EXEC_bookcase_back',6.8,-9.62,1.65,5.0,.14,3.25,walnut,.03)
for h in [.16,.94,1.72,2.5,3.27]:box('EXEC_shelf',6.8,-9.4,h,5.05,.56,.07,walnut,.02)
for x in [4.3,5.55,6.8,8.05,9.3]:box('EXEC_divider',x,-9.4,1.65,.08,.56,3.2,walnut,.015)
for row in range(4):
 for j in range(28):
  h=random.uniform(.28,.57);box('PRP_book',4.48+j*.17,-9.13,.21+row*.78+h/2,.105,.28,h,[blue,terra,green,ivory,walnut][j%5],.007)
box('EXEC_desk',6.6,-8.0,.85,3.4,.95,.15,walnut,.06)
for x in [5.15,8.05]:box('EXEC_pedestal',x,-8,.4,.28,.84,.8,walnut,.03)
monitor(6.5,-8.12,1.25);lamp(5.3,-8.15,.96);chair(6.6,-7.12,leather)
# 게임 공간: 테이블 축구, 다트, 주크박스와 두 개의 게임 캐비닛.
box('GAMES_rug',-10.2,2.0,.065,5.3,3.8,.03,terra,.25)
box('FOOSBALL_cabinet',-10.5,2.4,.79,2.05,1.15,.38,walnut,.06)
box('FOOSBALL_pitch',-10.5,2.4,1,1.88,1.0,.035,green,.01)
for x in [-11.25,-9.75]:
 for z in [1.95,2.85]:rod('FOOSBALL_leg',[(x,z,.65),(x,z,.09)],.06,metal)
for i in range(6):
 x=-11.25+i*.3;rod('FOOSBALL_rod',[(x,1.5,1.12),(x,3.3,1.12)],.014,metal)
 for z in [2.1,2.45,2.8]:box('FOOSBALL_player',x,z,1.11,.07,.065,.18,blue if i%2 else ivory,.015)
for x,color in [(-9.3,blue),(-8.3,terra)]:
 box('ARCADE_body',x,.4,.65,.78,.75,1.3,black,.035)
 box('ARCADE_top',x,.5,1.55,.84,.63,.2,color,.035)
 box('ARCADE_screen',x,.81,1.26,.61,.045,.43,screen,.02)
 box('ARCADE_panel',x,.88,.95,.83,.32,.1,color,.035)
 for j in range(3):ball('ARCADE_button',x-.15+j*.14,.98,1.02,(.03,.03,.018),[pink,light,green][j])
 rod('ARCADE_joystick',[(x-.26,.94,1.0),(x-.26,.94,1.14)],.015,black);ball('ARCADE_joystick_ball',x-.26,.94,1.15,(.04,.04,.04),terra)
box('JUKEBOX_body',-10.5,.35,.86,.9,.55,1.72,walnut,.3)
box('JUKEBOX_glow',-10.5,.65,1.0,.71,.05,1.23,pink,.27)
box('JUKEBOX_grill',-10.5,.69,.64,.49,.035,.58,brass,.07)
for x in [-10.67,-10.5,-10.33]:box('JUKEBOX_slot',x,.71,.64,.035,.01,.47,black,.01)
o=cylinder('DART_board',-13.75,.7,1.6,.45,.08,black);o.rotation_euler.y=math.pi/2
for radius,m in [(.35,terra),(.27,ivory),(.18,green),(.06,terra)]:
 o=cylinder('DART_ring',-13.69,.7,1.6,radius,.015,m);o.rotation_euler.y=math.pi/2
# 엘리베이터 문틈·간접광 및 리셉션 플루팅.
box('ELEVATOR_seam',-5.5,6.59,1.37,.014,.02,2.5,metal,.004)
for x in [-6.34,-4.66]:box('ELEVATOR_light',x,6.58,1.44,.035,.025,2.6,light,.01)
for j in range(32):box('RECEPTION_flute',-2.7+j*.085,7.43,.5,.025,.018,.76,brass,.008)
monitor(-1.7,6.8,1.45);lamp(-2.6,6.85,1.14)
# 잎에 굴곡과 끝점을 부여한 식물을 여러 크기로 배치한다.
def plant(x,z,scale=1,base=0):
 cylinder('PRP_planter',x,z,base+.27*scale,.28*scale,.54*scale,ivory,r2=.23*scale)
 cylinder('PRP_soil',x,z,base+.54*scale,.225*scale,.025,walnut)
 for j in range(9):
  a=j*2.399;h=(.78+j*.08)*scale;reach=(.35+(j%3)*.07)*scale
  dx=math.cos(a)*reach;dz=math.sin(a)*reach
  rod('PRP_plant_stem',[(x,z,base+.48*scale),(x+dx*.25,z+dz*.25,base+h*.85),(x+dx,z+dz,base+h)],.012*scale,leafm[0])
  verts=[(0,0,0),(-.14*scale,-.1*scale,.09*scale),(-.17*scale,-.28*scale,.10*scale),(0,-.51*scale,0),(.17*scale,-.28*scale,.1*scale),(.14*scale,-.1*scale,.09*scale),(0,-.25*scale,.14*scale)]
  faces=[(0,1,6),(1,2,6),(2,3,6),(3,4,6),(4,5,6),(5,0,6)]
  me=bpy.data.meshes.new('Leaf');me.from_pydata(verts,[],faces);me.materials.append(leafm[j%4]);me.update();o=bpy.data.objects.new('PRP_botanical_leaf',me);bpy.context.collection.objects.link(o);o.location=(x+dx,-z-dz,base+h);o.rotation_euler.z=-a
  sub=o.modifiers.new('Leaf curvature','SUBSURF');sub.levels=1
  solid=o.modifiers.new('Leaf thickness','SOLIDIFY');solid.thickness=.006
for x,z,s in [(-13.4,5.8,1.2),(-12,6.7,.9),(-10.4,5.8,1.05),(-13.5,-2.4,1.3),(-12.7,-7.7,1.2),(-11,-9.1,1.15),(-5.4,-9.1,1.2),(-3.3,-9.1,1.3),(1.5,-9.1,1.3),(3.3,-9.0,1.2),(10.4,-9.1,1.4),(10.3,-6.5,1.2),(10.5,-1.2,1.1),(9.5,2.5,1.2),(-6,-4.9,1.0),(-10.5,-4.8,1.0),(-6.8,4.3,1.0)]:plant(x,z,s)
for _,x,z,_ in benches:plant(x+1.98,z-.1,.38,.99)
plant(-8.3,-3.2,.3,.6);plant(-2.9,6.6,.38,1.1)
for x,z in [(.5,8),(2,8),(3.5,8),(7,7.5),(8.5,6.5)]:
 box('FRONT_planter',x,z,.29,1.2,.55,.58,walnut,.05);plant(x-.3,z,.63,.36);plant(x+.3,z,.7,.36);lamp(x+.62,z,.68)
# 같은 지오메트리를 복제할 때 서비스 식별 속성을 복제하지 않는다.
source=bpy.data.objects['CHAR_eden'];mapping={}
for old in [source]+list(source.children_recursive):
 n=old.copy()
 for k in list(n.keys()):del n[k]
 n.name=old.name.replace('eden','kyu');bpy.context.collection.objects.link(n);mapping[old]=n
for old,n in mapping.items():n.parent=mapping.get(old.parent)
kyu=mapping[source];kyu.name='CHAR_kyu';kyu.location=(-1.2,1.1,.06)
shirt=mat('KYU_Black','181d25',.85);denim=mat('KYU_Denim','223b59',.84);cap=mat('KYU_Blue','0865bb',.65)
for n in kyu.children_recursive:
 if n.type=='MESH':
  n.data=n.data.copy()
  if any(v in n.name for v in ['torso','sleeve','lapel']):n.data.materials.clear();n.data.materials.append(shirt)
  if 'trouser' in n.name:n.data.materials.clear();n.data.materials.append(denim)
head=bpy.data.objects['kyu_head']
o=uv('KYU_cap',(0,0,.2),(.345,.3,.23),cap);o.parent=head
o=cube('KYU_cap_brim',(0,-.32,.12),(.52,.39,.045),cap,.09);o.parent=head
o=cyl('KYU_cap_button',(0,0,.43),.04,.025,cap);o.parent=head
o=cube('KYU_cap_mark',(0,-.293,.27),(.045,.02,.13),ivory,.01);o.parent=head
o=cube('KYU_cap_mark_cross',(0,-.3,.27),(.12,.02,.035),ivory,.01);o.parent=head
body=bpy.data.objects['kyu_body'];o=cube('KYU_backpack',(0,.2,.96),(.37,.2,.4),black,.065);o.parent=body
o=line('KYU_keyring',[(.25+math.cos(a*math.tau/32)*.06,-.13,.69+math.sin(a*math.tau/32)*.085) for a in range(33)],.012,brass);o.parent=body
# 비서 마스코트: 독립된 눈·날개와 배를 가진 작은 펭귄.
ball('PENGUIN_body',-.65,6.65,1.39,(.27,.23,.38),black);ball('PENGUIN_belly',-.65,6.87,1.39,(.2,.065,.28),ivory)
ball('PENGUIN_head',-.65,6.65,1.79,(.25,.22,.24),black);ball('PENGUIN_face',-.65,6.84,1.79,(.2,.07,.17),ivory)
for x in [-.73,-.57]:ball('PENGUIN_eye',x,6.9,1.82,(.025,.02,.033),black)
ball('PENGUIN_beak',-.65,6.94,1.75,(.06,.08,.035),brass)
for x in [-.94,-.36]:ball('PENGUIN_wing',x,6.65,1.4,(.085,.12,.24),black)
scene=bpy.context.scene;scene.render.resolution_x=1024;scene.render.resolution_y=572
result={'objects':len(bpy.data.objects),'packedTextures':len([i for i in bpy.data.images if i.packed_file]),'owner':kyu.name,'benches':len(benches)}
