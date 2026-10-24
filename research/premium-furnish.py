# Higgsfield 호스팅 Blender용. 로컬에서 실행하지 않는다.
exec(bpy.data.texts['BSD_BUILD_LIB'].as_string())
random.seed(12)
oak=mat('Oak','c6945f',.5);stone=mat('Travertine','ddd1b9',.72);white=mat('Linen','eee5d5',.86);dark=mat('Bronze','51473a',.32,.6)
walnut=mat('Walnut','714c32',.4);brass=mat('Brass','b78a4b',.3,.75);black=mat('Graphite','242c31',.42,.25);cream=mat('Boucle','e4d7c2',.92);sage=mat('Sage','687c69',.8);terra=mat('Terracotta','b6664e',.85)
light=mat('Warm_LED','ffe6b5',.3,0,4);screen=mat('Screen_dark','17313c',.3,0,.4);blue=mat('Screen_blue','62b5bd',.4,0,.7);pink=mat('Screen_pink','d7a28d',.5,0,.5)
leafm=[mat('Leaf_'+str(i),c,.7) for i,c in enumerate(['315b38','426b3c','69894a','849d58'])]
for n in ['PROXY_sofa','PRP_Catalog_Sofa','sofa_3seat']:
 if bpy.data.objects.get(n):bpy.data.objects[n].hide_render=True;bpy.data.objects[n].hide_viewport=True
# 전체 벽은 낮은 플린스로 바꾸고, 세로 창살과 큰 유리창으로 개방감을 만든다.
wall=bpy.data.objects['ENV_left_wall'];wall.dimensions.z=.45;wall.location.z=.225
for y in [-6.2,-4.1,-2,0.1,2.2,4.3,6.3]:cube('ENV_left_mullion',(-9.2,y,2),(.08,.065,4),dark,.012)
cube('ENV_left_header',(-9.2,0,4),(.1,12.7,.12),dark)
# 바닥의 실제 판재 간격과 나무색 편차
planks=[mat('Oak_plank_'+str(i),c,.58) for i,c in enumerate(['bd936b','c39c72','cda478','d1aa80','c59b6e','b88d62'])]
for row in range(32):
 y=-6.2+row*.397
 for col in range(8):
  x=-8.15+col*2.33
  cube('ENV_floor_plank',(x,y,.035),(2.318,.387,.035),planks[(row*3+col*7)%6],.005)
# 라운지와 회의실 바닥, 가장자리 파이핑
cube('PRP_lounge_rug',(-5.7,-3.0,.085),(5.4,3.8,.045),sage,.3)
cube('PRP_meeting_rug',(5.9,-2.5,.085),(5.25,4.3,.04),cream,.35)
for x in [-5.8,-2,1.8]:
 cube('PRP_work_rug',(x,2.2,.075),(3.15,6.2,.03),mat('Work_rug','b3b7a5',.95),.2)
# 소파: 연속형 프레임, 분할 쿠션, 팔걸이, 실제 두께, 배색 베개
cube('PRP_sofa_frame',(-5.7,-3.75,.32),(3.65,1.15,.3),walnut,.13)
for x in [-7.25,-4.15]:
 for y in [-4.12,-3.38]:cyl('PRP_sofa_foot',(x,y,.16),.065,.24,brass)
cube('PRP_sofa_back',(-5.7,-4.2,.77),(3.65,.24,.85),cream,.12)
for x in [-7.43,-3.97]:cube('PRP_sofa_arm',(x,-3.75,.68),(.25,1.13,.65),cream,.12)
for x in [-6.82,-5.7,-4.58]:
 cube('PRP_sofa_seat',(x,-3.65,.56),(1.08,.85,.24),cream,.11)
 o=cube('PRP_sofa_back_cushion',(x,-4.02,.88),(1.06,.25,.64),white,.12);o.rotation_euler.x=math.radians(-8)
 line('PRP_sofa_stitch',[(x-.49,-3.22,.56),(x+.49,-3.22,.56)],.008,white)
for x,m,angle in [(-6.9,sage,-.15),(-4.45,terra,.17)]:
 o=cube('PRP_pillow',(x,-3.78,.89),(.56,.22,.55),m,.13);o.rotation_euler=(.15,angle,angle)
for x in [-6.3,-5.1]:cyl('PRP_coffee_foot',(x,-2.5,.23),.18,.4,brass)
# 좌석: 구부러진 등판과 분할 쿠션, 팔걸이, 가스 리프트, 5발 베이스
def chair(x,y,angle=0,material=sage,office=True):
 before=set(bpy.data.objects)
 cube('PRP_chair_seat',(0,0,.53),(.61,.56,.12),material,.12)
 o=cube('PRP_chair_back',(0,.25,.9),(.61,.14,.68),material,.14);o.rotation_euler.x=-.12
 cube('PRP_chair_back_inset',(0,.16,.91),(.48,.07,.48),material,.1)
 for side in [-1,1]:
  line('PRP_chair_arm',[(side*.33,.15,.53),(side*.33,.12,.78),(side*.33,-.17,.78)],.028,brass)
  cube('PRP_chair_arm_pad',(side*.33,-.015,.79),(.09,.36,.05),walnut,.025)
 if office:
  cyl('PRP_chair_piston',(0,0,.31),.045,.35,black)
  for i in range(5):
   a=i*math.tau/5;dx=math.cos(a)*.34;dy=math.sin(a)*.34
   line('PRP_chair_spoke',[(0,0,.16),(dx,dy,.11)],.035,black)
   uv('PRP_chair_wheel',(dx,dy,.09),(.065,.045,.065),black)
 else:
  for sx in [-1,1]:
   for sy in [-1,1]:line('PRP_chair_leg',[(sx*.23,sy*.2,.5),(sx*.29,sy*.25,.1)],.025,brass)
 for o in set(bpy.data.objects)-before:
  px,py,pz=o.location;o.location=(x+px*math.cos(angle)-py*math.sin(angle),y+px*math.sin(angle)+py*math.cos(angle),pz);o.rotation_euler.z+=angle
for i,(x,y) in enumerate([(-5.8,3.6),(-2,3.6),(1.8,3.6),(-5.8,.5),(-2,.5),(1.8,.5)]):
 chair(x,y+1.12,0,[sage,terra,sage,black,terra,black][i])
 # 2 화면, 키보드 실제 키, 트랙패드, 문서, 책, 데스크 조명
 cube('PRP_desk_drawer',(x+1.05,y,.56),(.4,.8,.52),walnut,.035)
 for h in [.44,.65]:cube('PRP_drawer_handle',(x+1.05,y+.409,h),(.22,.025,.02),brass,.01)
 cube('PRP_desk_mat',(x,y+.15,.907),(1.65,.65,.015),sage,.055)
 for dx in [-.53,.53]:
  cube('PRP_monitor_foot',(x+dx,y-.2,.93),(.36,.25,.035),black,.03)
  cube('PRP_monitor_stand',(x+dx,y-.24,1.09),(.045,.045,.29),brass,.01)
  cube('PRP_monitor_frame',(x+dx,y-.24,1.42),(.98,.06,.6),black,.035)
  cube('PRP_monitor_screen',(x+dx,y-.202,1.43),(.92,.008,.535),screen,.015)
  cube('PRP_screen_sidebar',(x+dx-.34,y-.195,1.43),(.16,.005,.49),mat('Screen_sidebar','234752',.5,0,.4),.003)
  for row in range(7):
   length=random.uniform(.15,.52)
   cube('PRP_screen_code',(x+dx-.18+length/2,y-.19,1.61-row*.055),(length,.004,.012),blue if row%3 else pink,.001)
 cube('PRP_keyboard',(x-.12,y+.3,.93),(.7,.25,.035),black,.025)
 for row in range(4):
  for key in range(11):cube('PRP_key',(x-.43+key*.058,y+.21+row*.055,.953),(.045,.04,.01),white,.004)
 cube('PRP_trackpad',(x+.48,y+.32,.93),(.18,.22,.025),stone,.02)
 cyl('PRP_mug',(x-1.05,y+.21,.99),.065,.15,white)
 for b in range(3):cube('PRP_notebook',(x+.99,y-.14,.93+b*.04),(.33,.45,.035),[terra,sage,white][b],.012)
 cyl('PRP_lamp_base',(x-1.1,y-.35,.93),.12,.025,brass)
 line('PRP_lamp_arm',[(x-1.1,y-.35,.94),(x-1.1,y-.35,1.48),(x-.92,y-.2,1.6)],.018,brass)
 cyl('PRP_lamp_shade',(x-.92,y-.2,1.56),.14,.11,sage,r2=.06)
for x in [4.9,6,7.1]:
 chair(x,-1.25,0,terra,False);chair(x,-3.75,math.pi,terra,False)
# 회의실 디스플레이, 메모와 노트북
for x in [5.2,6.7]:
 cube('PRP_meeting_notebook',(x,-2.5,.93),(.45,.55,.025),white,.01)
 cyl('PRP_meeting_glass',(x+.3,-2.2,1.0),.055,.17,mat('Ceramic_teal','527b78',.23))
cube('PRP_wall_display',(6.8,6.23,2.3),(3.3,.09,1.75),black,.06)
cube('PRP_wall_display_face',(6.8,6.17,2.3),(3.15,.02,1.6),screen,.03)
txt('PRP_display_type','BSD / STUDIO',(6.8,6.14,2.5),.28,white)
txt('PRP_display_sub','MAKE GOOD THINGS',(6.8,6.14,2.13),.12,light)
# 우측 뒤 커피 바
cube('PRP_bar_cabinet',(6.1,4.6,.52),(4.2,.85,1.04),walnut,.08)
cube('PRP_bar_marble',(6.1,4.6,1.08),(4.3,.95,.12),stone,.04)
for x in [4.5,5.3,6.1,6.9,7.7]:
 line('PRP_bar_panel',[(x,4.16,.12),(x,4.16,.96)],.008,brass)
 cube('PRP_bar_handle',(x+.32,4.16,.8),(.17,.025,.025),brass,.01)
cube('PRP_espresso_machine',(5,4.62,1.41),(.7,.55,.6),black,.05)
cube('PRP_espresso_face',(5,4.32,1.42),(.57,.025,.4),brass,.02)
cube('PRP_espresso_tray',(5,4.18,1.2),(.63,.33,.035),black,.02)
for x in [4.86,5.14]:
 cyl('PRP_espresso_knob',(x,4.28,1.55),.05,.03,black).rotation_euler.x=math.pi/2
 cyl('PRP_cup',(x,4.2,1.28),.06,.1,white)
for x in [6,6.25,6.5]:cyl('PRP_bar_canister',(x,4.63,1.32),.09,.35,white)
txt('PRP_bar_name','THE DAILY',(7.2,4.11,.6),.18,white)
# 리셉션에 촘촘한 목재 플루트와 황동 로고
for i in range(38):cube('PRP_reception_flute',(-2.24+i*.078,-5.42,.55),(.037,.035,.9),walnut,.012)
cube('PRP_reception_top',(-.8,-5,1.18),(3.17,.87,.07),stone,.07)
txt('PRP_brand','BSD  ATELIER',(-.8,-5.46,.69),.23,brass)
txt('PRP_brand_sub','INDEPENDENT DIGITAL STUDIO',(-.8,-5.465,.43),.065,white)
cube('PRP_reception_monitor',(-1.3,-5,1.4),(.6,.06,.4),black,.025)
# 곡면 잎과 분기 줄기: 구형 덩어리 대신 식물의 실루엣을 만든다.
def plant(x,y,height=1.7,size=.32):
 cyl('PRP_planter',(x,y,size*.65),size,size*1.3,white,r2=size*.87)
 cyl('PRP_soil',(x,y,size*1.31),size*.83,.025,walnut)
 for j in range(7):
  a=j*2.399;z=size*1.3+(height-size*1.3)*(0.45+j/12);r=height*.23
  end=(x+math.cos(a)*r,y+math.sin(a)*r,z)
  line('PRP_plant_stem',[(x,y,size*1.2),(x+.08*math.cos(a),y+.08*math.sin(a),z*.8),end],.012,leafm[0])
  for k in [-1,1]:
   length=height*.23;w=height*.085;verts=[];faces=[]
   for t in range(9):
    f=t/8;wid=math.sin(f*math.pi)**.7*w
    for side in [-1,0,1]:verts.append((f*length,side*wid,math.sin(f*math.pi)*length*.2-abs(side)*.025))
   for t in range(8):
    for s in range(2):i=t*3+s;faces.append((i,i+1,i+4,i+3))
   mesh=bpy.data.meshes.new('Leaf blade');mesh.from_pydata(verts,[],faces);mesh.materials.append(leafm[(j+k)%4]);mesh.update()
   ob=bpy.data.objects.new('PRP_botanical_leaf',mesh);bpy.context.collection.objects.link(ob);ob.location=end;ob.rotation_euler=(0,k*.35,a+k*.6)
   for poly in mesh.polygons:poly.use_smooth=True
for x,y,h in [(-8.4,5.5,2),(-8.4,1.5,1.7),(-8.4,-4.9,1.8),(3.3,5.7,1.8),(8.5,5.5,2),(8.5,-5.4,1.8),(3.2,-5.4,1.4),(-3.3,-3.9,1.5)]:plant(x,y,h)
for x,y in [(-5.7,-2.5),(-.1,-5),(7.5,4.6)]:
 before=set(bpy.data.objects);plant(0,0,.37,.09)
 for ob in set(bpy.data.objects)-before:ob.location+=Vector((x,y,.48 if y==-2.5 else 1.23 if y==-5 else 1.15))
# 조명 기구, 얇은 현수선과 빛나는 구형 램프
for x,y in [(-5.8,3.6),(-2,3.6),(1.8,3.6),(5.5,-2.5),(6.8,-2.5)]:
 line('PRP_pendant_wire',[(x,y,4.25),(x,y,3)],.009,dark)
 cyl('PRP_pendant_cap',(x,y,3.05),.12,.15,brass)
 uv('PRP_pendant_globe',(x,y,2.86),(.2,.2,.22),light)
for x in [-9.1,9.1]:cube('ENV_plinth_light',(x,0,-.12),(.025,12.6,.025),light,.005)
cube('ENV_plinth_front_light',(0,-6.45,-.12),(18.4,.025,.025),light,.005)
# 렌더는 깊이와 접지감을 먼저 검사한다.
scene=bpy.context.scene;scene.camera.location=(18,-22,17);aim(scene.camera,(0,0,.7));scene.render.resolution_x=1100;scene.render.resolution_y=820
bpy.data.objects['LGT_key'].data.energy=2.7;bpy.data.objects['LGT_fill'].data.energy=2200
scene.world.node_tree.nodes.get('Background').inputs[1].default_value=.55
target=artifacts.file(name='furnished.png',media_type='image/png');scene.render.filepath=str(target.path);scene.render.image_settings.media_type='IMAGE';scene.render.image_settings.file_format='PNG';bpy.ops.render.render(write_still=True);target.publish()
result={'objects':len(bpy.data.objects),'materials':len(bpy.data.materials),'stage':'detailed furniture'}
