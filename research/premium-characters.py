# 원본 캐릭터의 독립된 관절 계층을 생성한다. 변형과 이동은 웹 런타임에서 수행한다.
exec(bpy.data.texts['BSD_BUILD_LIB'].as_string())
def group(n,loc=(0,0,0),parent=None):
 o=bpy.data.objects.new(n,None);bpy.context.collection.objects.link(o);o.location=loc;o.parent=parent;return o
def attach(o,p):o.parent=p;return o
def loft(n,sections,material,parent):
 verts=[];faces=[];count=24
 for z,rx,ry,cy in sections:
  for j in range(count):
   a=j*math.tau/count;verts.append((math.cos(a)*rx,cy+math.sin(a)*ry,z))
 for i in range(len(sections)-1):
  for j in range(count):a=i*count+j;b=i*count+(j+1)%count;faces.append((a,b,b+count,a+count))
 faces.append(tuple(reversed(range(count))));faces.append(tuple((len(sections)-1)*count+j for j in range(count)))
 mesh=bpy.data.meshes.new(n);mesh.from_pydata(verts,[],faces);mesh.materials.append(material);mesh.update()
 o=bpy.data.objects.new(n,mesh);bpy.context.collection.objects.link(o);o.parent=parent
 for f in mesh.polygons:f.use_smooth=True
 sub=o.modifiers.new('Tailored smooth silhouette','SUBSURF');sub.levels=1;sub.render_levels=1
 return o
charlib=[]
data=[('eden','286b59','372b25','f2c9a5',-5.8,4.72),('sora','ae7849','473223','f6d2ba',-2,4.72),('yuna','c17b6b','482e32','f3c4ad',1.8,4.72),('leo','527ca2','202a35','eac2a5',-5.8,1.62),('noah','82759e','43372e','bd8868',-2,1.62),('june','7a8e57','393832','f2ccad',1.8,1.62)]
white=mat('Sneaker_ivory','eeeae2',.65);black=mat('Eyes_obsidian','1a191b',.12);iris=mat('Eyes_iris','695038',.3);mouth=mat('Mouth','985647',.65);trouser=mat('Trouser','303941',.87);gold=mat('Brass','b78a4b',.3,.75)
for index,(id,color,haircolor,skincolor,x,y) in enumerate(data):
 root=group('CHAR_'+id,(x,y,0));body=group(id+'_body',parent=root)
 skin=mat(id+'_skin',skincolor,.5);shirt=mat(id+'_jacket',color,.8);hair=mat(id+'_hair',haircolor,.48);blush=mat(id+'_blush','dc9c88',.65)
 # 볼과 턱이 이어지는 얼굴 윤곽
 head=group(id+'_head',(0,0,1.47),body)
 attach(uv(id+'_face',(0,-.005,0),(.315,.275,.34),skin),head)
 attach(uv(id+'_chin',(0,-.055,-.19),(.22,.21,.145),skin),head)
 for side in [-1,1]:
  attach(uv(id+'_ear',(side*.305,0,-.03),(.065,.048,.09),skin),head)
  attach(uv(id+'_ear_inner',(side*.333,-.025,-.03),(.024,.015,.047),blush),head)
  attach(uv(id+'_cheek',(side*.18,-.237,-.09),(.081,.025,.047),blush),head)
 # 입과 코, 눈썹, 눈의 홍채와 작은 하이라이트
 eyes=group(id+'_eyes',(0,-.264,.005),head)
 for side in [-1,1]:
  attach(uv(id+'_eye_white',(side*.119,0,0),(.058,.028,.072),white),eyes)
  attach(uv(id+'_iris',(side*.119,-.025,-.001),(.031,.013,.045),iris),eyes)
  attach(uv(id+'_pupil',(side*.119,-.036,0),(.018,.008,.031),black),eyes)
  attach(uv(id+'_eye_glint',(side*.119-.01,-.043,.017),(.009,.005,.011),white),eyes)
  attach(line(id+'_brow',[(side*.07,-.257,.104),(side*.12,-.264,.117),(side*.17,-.249,.108)],.012,hair),head)
 attach(uv(id+'_nose',(0,-.29,-.07),(.041,.048,.049),skin),head)
 attach(line(id+'_smile',[(-.059,-.266,-.145),(-.025,-.281,-.16),(.017,-.283,-.164),(.054,-.268,-.149)],.009,mouth),head)
 # 頭皮는 전체 구가 아닌 정점으로 만든 모자형 면, 앞머리는 가닥별로 납작하고 끝이 가늘어진다.
 verts=[];faces=[];rings=10;segments=40
 for ring in range(rings+1):
  f=ring/rings
  for j in range(segments):
   a=j*math.tau/segments
   front=max(0,-math.sin(a));end=1.65-.52*front
   theta=.02+f*end
   verts.append((.329*math.sin(theta)*math.cos(a),.29*math.sin(theta)*math.sin(a)+.016,.355*math.cos(theta)+.015))
 for ring in range(rings):
  for j in range(segments):a=ring*segments+j;b=ring*segments+(j+1)%segments;faces.append((a,b,b+segments,a+segments))
 mesh=bpy.data.meshes.new(id+'_haircap');mesh.from_pydata(verts,[],faces);mesh.materials.append(hair);mesh.update()
 o=bpy.data.objects.new(id+'_haircap',mesh);bpy.context.collection.objects.link(o);o.parent=head
 for p in mesh.polygons:p.use_smooth=True
 for j in range(9):
  sx=-.25+j*.059
  pts=[]
  for k in range(7):
   f=k/6;pts.append((sx+.12*f,-.16-.13*math.sin(f*math.pi/2),.29-.17*f+.035*math.sin(f*math.pi)))
  c=bpy.data.curves.new(id+'_hairstrand','CURVE');c.dimensions='3D';c.bevel_depth=.043;c.bevel_resolution=3
  sp=c.splines.new('NURBS');sp.points.add(len(pts)-1)
  for k,(p,co) in enumerate(zip(sp.points,pts)):p.co=(*co,1);p.radius=max(.08,1-k/7)
  sp.order_u=3;sp.use_endpoint_u=True
  ob=bpy.data.objects.new(id+'_hairstrand',c);bpy.context.collection.objects.link(ob);c.materials.append(hair);ob.parent=head
 if index in [1,2]:
  for side in [-1,1]:
   attach(uv(id+'_bob',(side*.265,.095,-.02),(.09,.18,.29),hair),head)
  if index==1:attach(uv(id+'_hairbun',(.18,.28,.11),(.16,.14,.16),hair),head)
 if index in [0,4]:
  for side in [-1,1]:
   points=[(side*.119+math.cos(a*math.tau/32)*.086,-.308,.004+math.sin(a*math.tau/32)*.092) for a in range(33)]
   attach(line(id+'_glasses',points,.008,gold),head)
  attach(line(id+'_glasses_bridge',[(-.034,-.308,.012),(0,-.32,.025),(.034,-.308,.012)],.008,gold),head)
 if index==3:
  pts=[(math.cos(a*math.pi/24)*.35,0,math.sin(a*math.pi/24)*.37+.01) for a in range(25)]
  attach(line(id+'_headphones',pts,.023,trouser),head)
  for side in [-1,1]:attach(uv(id+'_earcup',(side*.343,0,.01),(.055,.095,.12),gold),head)
 # 몸통은 여러 단면을 잇는 재킷과 안쪽 티셔츠로 구성
 loft(id+'_torso',[(.69,.17,.12,0),(.73,.235,.155,0),(.92,.235,.155,0),(1.06,.25,.14,0),(1.13,.19,.12,0),(1.16,.105,.09,0)],shirt,body)
 attach(cyl(id+'_neck',(0,0,1.2),.09,.13,skin),body)
 attach(cube(id+'_tshirt',(0,-.146,1.02),(.16,.018,.22),white,.035),body)
 for side in [-1,1]:
  o=attach(cube(id+'_lapel',(side*.115,-.151,1.045),(.09,.035,.24),shirt,.025),body);o.rotation_euler.y=side*.27
  attach(line(id+'_seam',[(side*.21,-.09,.75),(side*.235,-.11,.9),(side*.22,-.10,1.04)],.006,white),body)
 for z in [.81,.9]:attach(uv(id+'_button',(.03,-.164,z),(.013,.009,.013),gold),body)
 attach(cube(id+'_badge',(.14,-.16,1.01),(.065,.012,.085),white,.008),body)
 for side,suffix in [(-1,'L'),(1,'R')]:
  arm=group(id+'_arm'+suffix,(side*.28,0,1.09),body)
  loft(id+'_sleeve'+suffix,[(-.265,.064,.065,0),(-.24,.077,.078,0),(-.05,.09,.085,0),(0,.06,.065,0)],shirt,arm)
  attach(cyl(id+'_cuff'+suffix,(0,0,-.253),.073,.045,white),arm)
  fore=group(id+'_forearm'+suffix,(0,0,-.25),arm)
  loft(id+'_forearm_skin'+suffix,[(-.19,.047,.05,0),(-.14,.06,.06,0),(0,.064,.065,0)],skin,fore)
  attach(uv(id+'_palm'+suffix,(0,-.015,-.205),(.063,.043,.078),skin),fore)
  attach(uv(id+'_thumb'+suffix,(-side*.05,-.038,-.184),(.025,.028,.04),skin),fore)
  for f in range(3):attach(line(id+'_finger'+suffix,[(.028-f*.025,-.047,-.2),(.028-f*.025,-.049,-.249)],.0025,blush),fore)
  thigh=group(id+'_leg'+suffix,(side*.128,0,.72),body)
  loft(id+'_trouser_thigh'+suffix,[(-.31,.079,.085,0),(-.2,.095,.1,0),(0,.1,.115,0)],trouser,thigh)
  shin=group(id+'_shin'+suffix,(0,0,-.3),thigh)
  loft(id+'_trouser_calf'+suffix,[(-.25,.067,.07,0),(-.12,.078,.08,0),(0,.079,.085,0)],trouser,shin)
  attach(cyl(id+'_sock'+suffix,(0,0,-.25),.067,.09,white),shin)
  attach(cube(id+'_shoe_sole'+suffix,(0,-.055,-.313),(.2,.35,.055),white,.04),shin)
  attach(uv(id+'_shoe_upper'+suffix,(0,-.055,-.268),(.097,.16,.075),shirt),shin)
  attach(cube(id+'_shoe_toe'+suffix,(0,-.16,-.28),(.18,.12,.065),white,.03),shin)
  for f in range(3):attach(line(id+'_lace'+suffix,[(-.05,-.04-f*.03,-.2),(.05,-.05-f*.03,-.2)],.006,white),shin)
 charlib.append(root.name)
# 장면 렌더에서 정면을 확인할 수 있게 일단 서 있는 자세를 유지한다.
scene=bpy.context.scene
target=artifacts.file(name='characters-scene.png',media_type='image/png');scene.render.filepath=str(target.path);scene.render.image_settings.media_type='IMAGE';scene.render.image_settings.file_format='PNG';bpy.ops.render.render(write_still=True);target.publish()
result={'characters':charlib,'count':len(charlib),'motion':'web joint controls','objects':len(bpy.data.objects)}
