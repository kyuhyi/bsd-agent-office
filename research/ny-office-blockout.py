# Higgsfield 호스팅 Blender에서 실행하는 원본 구도 재구성.
exec(bpy.data.texts['BSD_BUILD_LIB'].as_string())
# 기존 직원 리그는 보존하고 이전 공간은 버전 이력에 남긴 채 교체한다.
keep=set()
for root in [o for o in bpy.data.objects if o.name.startswith('CHAR_')]:
 keep.add(root);keep.update(root.children_recursive)
for o in list(bpy.data.objects):
 if o not in keep:bpy.data.objects.remove(o,do_unlink=True)
def box(n,x,z,h,w,d,t,m,b=.04):return cube(n,(x,-z,h),(w,d,t),m,b)
def roundtop(n,x,z,h,w,d,t,m):
 o=cyl(n,(x,-z,h),1,t,m);o.scale.x=w/2;o.scale.y=d/2;return o
floor=mat('NY_Charcoal_oak','333437',.66);ivory=mat('NY_Ivory','e7e4dc',.5);walnut=mat('NY_Walnut','644832',.48);metal=mat('NY_Metal','27333e',.32,.7)
blue=mat('NY_Blue','365d77',.85);terra=mat('NY_Terra','ad5c44',.82);green=mat('NY_Green','547454',.8);rug=mat('NY_Rug','777b81',.96);light=mat('NY_Light','ffe3ad',.3,0,3)
box('ENV_floor',-1.5,-.5,-.22,25,19,.45,metal,.08)
box('ENV_floor_surface',-1.5,-.5,.015,24.85,18.85,.04,floor,.015)
for x in range(-14,12,2):box('ENV_window_post',x,-10,2.1,.055,.09,4.2,metal,.009)
for z in range(-10,10,2):box('ENV_window_post',-14,z,2.1,.09,.055,4.2,metal,.009)
box('ENV_back_header',-1.5,-10,4.2,25,.11,.09,metal,.01)
box('ENV_left_header',-14,-.5,4.2,.11,19,.09,metal,.01)
for x,z in [(-14,-10),(-14,-2),(2,-10),(11,-10)]:
 cyl('ENV_column',(x,-z,1.9),.38,3.8,ivory)
 box('ENV_sconce',x,z+.39,1.8,.09,.05,.45,light,.035)
# 각 구역을 독립 부모로 만들어 상세 자산을 넣을 자리를 고정한다.
zones=[('lounge',-8.3,-4.1,5.5,4.1,rug),('meeting',-3.6,-2.3,5.7,3.6,rug),('devA',-.65,-7.1,4.9,2.65,blue),('devB',2.75,-1.8,4.9,2.65,blue),('planA',-2.9,2.35,4.9,2.65,terra),('planB',4.9,3.1,4.9,2.65,terra),('ops',8.05,-3.0,4.9,2.65,green),('executive',6.3,-8.9,4.5,2.6,rug)]
for n,x,z,w,d,m in zones:box('ZONE_'+n,x,z,.055,w,d,.035,m,.42)
benches=[('devA',-.65,-7.1,blue),('devB',2.75,-1.8,blue),('planA',-2.9,2.35,terra),('planB',4.9,3.1,terra),('ops',8.05,-3.0,green)]
for n,x,z,m in benches:
 box('DESK_'+n,x,z,.91,4.25,.94,.14,ivory,.065)
 for side in [-1,1]:box('DESK_'+n+'_end',x+side*2,z,.46,.18,.88,.86,walnut,.03)
 box('SIGN_'+n,x,z-.28,1.76,3.7,.075,.47,m,.025)
roundtop('MEETING_table',-3.6,-2.3,.82,4.2,1.8,.15,ivory)
for x in [-4.8,-2.4]:box('MEETING_base',x,-2.3,.4,.26,.8,.8,walnut,.04)
box('SOFA_frame',-8.3,-5.0,.35,3.8,1.25,.38,walnut,.12)
box('SOFA_back',-8.3,-5.5,.83,3.8,.28,.92,walnut,.15)
box('LOUNGE_coffee',-8.3,-3.25,.52,1.6,.86,.12,ivory,.1)
box('BAR_counter',-8.2,-9.1,1.16,5.7,.65,.14,walnut,.05)
box('RECEPTION_body',-1.35,6.8,.51,3.2,1.25,1.02,walnut,.4)
box('RECEPTION_top',-1.35,6.8,1.05,3.3,1.34,.1,ivory,.4)
box('ELEVATOR_frame',-5.5,6.1,1.48,2.0,.9,2.96,metal,.08)
box('ELEVATOR_doors',-5.5,6.57,1.35,1.5,.025,2.58,ivory,.012)
for i in range(12):box('STAIRS_step',-12.45,2.9-i*.38,.12+i*.16,2.3,.39,.22,walnut,.025)
scene=bpy.context.scene
bpy.ops.object.camera_add(location=(18,-24,20.52));cam=bpy.context.object;cam.name='CAM_main';cam.data.type='ORTHO';cam.data.ortho_scale=27;aim(cam,(0,0,3.2));scene.camera=cam
bpy.ops.object.light_add(type='SUN',location=(-8,-2,14));key=bpy.context.object;key.name='LGT_key';key.data.energy=2.3;key.data.angle=.18;key.data.color=(1,.82,.61);aim(key,(0,0,0))
bpy.ops.object.light_add(type='POINT',location=(3,4,8));fill=bpy.context.object;fill.name='LGT_fill';fill.data.energy=1900;fill.data.shadow_soft_size=5;fill.data.color=(.6,.73,1)
scene.world.color=(.16,.2,.27);scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=1024;scene.render.resolution_y=572;scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'
# 원본 좌석 배치에 맞춰 위치만 먼저 바꾼다. 동작 목적지는 클라이언트의 동일 데이터와 맞춘다.
homes={'eden':(7.1,-2.1),'sora':(-3.85,3.25),'yuna':(3.95,4.0),'leo':(-1.6,-6.2),'noah':(1.8,-.9),'june':(3.7,-.9)}
for name,(x,z) in homes.items():bpy.data.objects['CHAR_'+name].location=(x,-z,.06)
target=artifacts.file(name='ny-blockout.png',media_type='image/png');scene.render.filepath=str(target.path);scene.render.image_settings.media_type='IMAGE';scene.render.image_settings.file_format='PNG';bpy.ops.render.render(write_still=True);target.publish()
result={'objects':len(bpy.data.objects),'benches':5,'room':[25,19],'homes':homes}
